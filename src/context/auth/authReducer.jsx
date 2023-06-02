
export const initialValues = {
    user: {},
    userToken: null,
    isLoading: false,
    isSignout: false,
}

export default function authReducer({state, action}) {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...state,
                userToken: action.token,
                user: action.user,
                isLoading: false,
            };
        case 'SIGN_IN':
            return {
                ...state,
                isSignout: false,
                isLoading: true,
                userToken: action.token,
                user: action.user
            };
        case 'SIGN_OUT':
            return {
                ...state,
                isSignout: true,
                userToken: null,
                user: {}
            };
        case 'LOADED':
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
}