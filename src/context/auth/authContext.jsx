import React, {useMemo, useReducer} from 'react';
import authReducer, {initialValues} from './authReducer';
import {authService} from '../../services/authService';
import useAsyncStorage from '../../hooks/useAsyncStorage';

export const AuthContext = React.createContext({});

export default function AuthProvider ({children}) {
    const [state, dispatch] = useReducer(authReducer, initialValues);
    const [storage, setStorage] = useAsyncStorage('user', '');

    const authContext = useMemo(() => ({
        signIn: async (data) => {
            console.log(data);
            let session = await authService.login(data.email, data.password);
            
            if(session.error) {
                return session.message;
            }

            let estado = {
                token: session.data.access_token,
                user: session.data.user
            }

            setStorage(estado);
            dispatch({type: 'SIGN_IN', estado});
        },
        signOut: () => { dispatch({type: 'SIGN_OUT'}); setStorage(''); },
        restoreToken: async () => {
            let user = storage;
            console.log('user', user);
            dispatch({type: 'RESTORE_TOKEN', token: user.token, user: user.user});
        },
        getState: () => { return state; }
    }), []);
    
    return (
        <AuthContext.Provider value={[state, dispatch]}>
        {children} 
        </AuthContext.Provider>
    );
}