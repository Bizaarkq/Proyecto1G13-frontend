import React, {useContext, useEffect} from 'react';
import {authService} from './src/services/authService.js';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IconButton, MD3Colors} from 'react-native-paper';
import Login from './src/components/auth/login.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PaperProvider} from 'react-native-paper';
import {HomeEstudiante, HomeDocente} from './src/components/menu/home.jsx';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import {RevisionEstudiante} from './src/views/Estudiante-Revision.jsx';
import {SolicitudRevision} from './src/components/revision/solicitudRev';

export const AuthContext = React.createContext({});

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.estado.token,
            user: action.estado.user,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            isLoading: false,
            userToken: action.estado.token,
            user: action.estado.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoading: false,
            isSignout: true,
            userToken: null,
            user: null,
          };
        case 'LOADING':
          return {
            ...prevState,
            isLoading: true,
          };
        default:
          return state;
      }
    },
    {
      isLoading: false,
      isSignout: false,
      userToken: null,
      user: null,
    },
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let user = await AsyncStorage.getItem('user');
      user = JSON.parse(user);
      if (user !== null) {
        let estado = {
          token: user.token,
          user: user.user,
        };
        dispatch({type: 'RESTORE_TOKEN', estado});
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({type: 'LOADING'});
        let session = await authService.login(data.email, data.password);
        if (session.error) {
          dispatch({type: 'SIGN_OUT'});
        }

        let estado = {
          token: session.data.access_token,
          user: session.data.user,
        };
        await AsyncStorage.setItem('user', JSON.stringify(estado));
        dispatch({type: 'SIGN_IN', estado});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      restoreToken: async () => {
        let user = await AsyncStorage.getItem('user');
        if (!user) {
          let estado = {
            token: user.token,
            user: user.user,
          };
          dispatch({type: 'RESTORE_TOKEN', estado});
        }
      },
      getState: () => dispatch({type: 'GET_STATE'}),
    }),
    [],
  );

  return (
    <>
      <AuthContext.Provider value={authContext}>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {state?.isLoading ? (
                <Stack.Screen name="splash" component={SplashScreen} />
              ) : state.userToken === null ? (
                <Stack.Screen name="Login" component={Login} />
              ) : (
                <>
                  <Stack.Screen
                    name="Inicio"
                    component={
                      state.user?.role == 'estudiante'
                        ? HomeEstudiante
                        : HomeDocente
                    }
                    initialParams={{
                      user: state.user,
                    }}
                    options={{
                      headerRight: () => (
                        <IconButton
                          icon="logout"
                          iconColor={MD3Colors.red800}
                          size={30}
                          mode="contained"
                          onPress={async () => {
                            await AsyncStorage.removeItem('user');
                            dispatch({type: 'SIGN_OUT'});
                          }}
                        />
                      ),
                    }}
                  />
                  <Stack.Screen
                    name="RevisionEstudiante"
                    component={RevisionEstudiante}
                    initialParams={{
                      user: state.userToken,
                    }}
                  />
                  <Stack.Screen
                    name="SolicitudRevision"
                    component={SolicitudRevision}
                    initialParams={{
                      user: state.userToken,
                    }}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </AuthContext.Provider>
    </>
  );
}

function SplashScreen() {
  return (
    <ActivityIndicator size="large" animating={true} color={MD2Colors.red800} />
  );
}

export default App;
