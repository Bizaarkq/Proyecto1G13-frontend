import {API_URL} from '@env';

export const endpoints = {
    auth: {
        login: `${API_URL}/auth/login`,
        me: `${API_URL}/auth/me`,
        logout: `${API_URL}/auth/logout`
    },
    revision: {
        docente: {
            get: `${API_URL}/revision/docente`,
            pendientes: `${API_URL}/revision/pendientes`,
            aprobar: `${API_URL}/revision/aprobar`
        },
        estudiante: {
            get: `${API_URL}/revision/estudiante`,
            solicitar: `${API_URL}/revision/solicitar`,
            evaluaciones: `${API_URL}/revision/evaluaciones`
        }
    },
    evaluacion: {
        docente: {
            getEvaluaciones: `${API_URL}/evaluacion/evaluaciones-estudiantes`,
            crear: `${API_URL}/evaluacion/crear`,
            marcarAsis: `${API_URL}/evaluacion/marcar-asistencia`,
            regNota: `${API_URL}/evaluacion/registrar-nota`,
        },
        estudiante: {
            getEvaluaciones: `${API_URL}/evaluacion/estudiante`,
        }
    }
    
}