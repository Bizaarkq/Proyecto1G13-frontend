import React, {useContext, useEffect} from 'react';
import {authService} from './src/services/authService.js';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IconButton, MD3Colors} from 'react-native-paper';
import Login from './src/components/auth/login.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PaperProvider, MD3LightTheme as DefaultTheme} from 'react-native-paper';
import {HomeEstudiante, HomeDocente, HomeImpresor, HomeAdmin, HomeCoordinador} from './src/components/menu/home.jsx';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import {RevisionEstudiante} from './src/views/Estudiante-Revision.jsx';
import {SolicitudRevision} from './src/components/revision/solicitudRev';
import {EvaluacionEst} from './src/components/evaluacion/evaEstudiante';
import {SolPendientesDoc} from './src/components/revision/docSolRevision';
import {DetalleSolicitud} from './src/components/revision/detalleSol';
import {RevisionesDocente} from './src/views/DocenteRevision';
import {RevisionDetalle} from './src/components/revision/revisionDetalle';
import {AprobDiffRep} from './src/components/evaluacion/aprobarDifRep';
import {EvaluacionesDocente} from './src/components/impresion/solDocente';
import {AprobImpresiones} from './src/components/impresion/aprobarImp';
import {CrearUsuario} from './src/components/auth/createUser';
import {AprobRegistro} from './src/components/auth/aprobarRegistro';

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
        if (!session.success) {
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
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator>
              {state?.isLoading ? (
                <Stack.Screen name="splash" options={{ title: 'Iniciando sesión' }} component={SplashScreen} />
              ) : state.userToken === null ? (
                <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="CrearUsuario" options={{ title: 'Registrarse' }} component={CrearUsuario} />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="Inicio"
                    component={
                      state.user?.role.includes('estudiante')
                        ? HomeEstudiante
                        : ( state.user?.role.includes('coordinador')
                            ? HomeCoordinador 
                            : ( state.user?.role.includes('docente')
                                ? HomeDocente
                                : ( state.user?.role.includes('director')
                                ? HomeAdmin
                                : HomeImpresor
                              )
                            )
                          )
                    }
                    initialParams={{
                      user: state.user?.role == 'director' ? state.userToken : state.user,
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
                    options={{ title: 'Revisiones' }}
                  />
                  <Stack.Screen
                    name="SolicitudRevision"
                    component={SolicitudRevision}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Solicitud' }}
                  />
                  <Stack.Screen
                    name="EvaluacionesEstudiante"
                    component={EvaluacionEst}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Evaluaciones' }}
                  />
                  <Stack.Screen
                    name="SolicitudesRevisionDocente"
                    component={SolPendientesDoc}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Solicitudes Pendientes' }}
                  />
                  <Stack.Screen
                    name="DetalleSolicitud"
                    component={DetalleSolicitud}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Detalle solicitud' }}
                  />
                  <Stack.Screen
                    name="RevisionDocente"
                    component={RevisionesDocente}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Revisiones' }}
                  />
                  <Stack.Screen
                    name="RevisionDetalle"
                    component={RevisionDetalle}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Detalle revision' }}
                  />
                  <Stack.Screen
                    name="AprobarDiffRep"
                    component={AprobDiffRep}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Solicitudes diferidos/repetidos' }}
                  />
                  <Stack.Screen
                    name="SolicitudImpresion"
                    component={EvaluacionesDocente}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Detalle solicitud' }}
                  />
                  <Stack.Screen
                    name="RevisionImpresor"
                    component={AprobImpresiones}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Solicitudes de impresión' }}
                  />
                  <Stack.Screen
                    name="AprobRegistro"
                    component={AprobRegistro}
                    initialParams={{
                      user: state.userToken,
                    }}
                    options={{ title: 'Solicitudes de registro' }}
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

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    "primary": "rgb(179, 39, 42)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(255, 218, 215)",
    "onPrimaryContainer": "rgb(65, 0, 4)",
    "secondary": "rgb(0, 103, 126)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(180, 235, 255)",
    "onSecondaryContainer": "rgb(0, 31, 40)",
    "tertiary": "rgb(114, 91, 46)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(255, 222, 166)",
    "onTertiaryContainer": "rgb(39, 25, 0)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 251, 255)",
    "onBackground": "rgb(32, 26, 26)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(32, 26, 26)",
    "surfaceVariant": "rgb(245, 221, 219)",
    "onSurfaceVariant": "rgb(83, 67, 66)",
    "outline": "rgb(133, 115, 113)",
    "outlineVariant": "rgb(216, 194, 191)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(54, 47, 46)",
    "inverseOnSurface": "rgb(251, 238, 236)",
    "inversePrimary": "rgb(255, 179, 174)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(251, 240, 244)",
      "level2": "rgb(249, 234, 238)",
      "level3": "rgb(247, 228, 232)",
      "level4": "rgb(246, 226, 229)",
      "level5": "rgb(244, 221, 225)"
    },
    "surfaceDisabled": "rgba(32, 26, 26, 0.12)",
    "onSurfaceDisabled": "rgba(32, 26, 26, 0.38)",
    "backdrop": "rgba(59, 45, 44, 0.4)"
  },
};

export default App;

