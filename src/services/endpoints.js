import {API_URL} from '@env';

export const endpoints = {
    auth: {
        login: `${API_URL}/auth/login`,
        me: `${API_URL}/auth/me`,
        logout: `${API_URL}/auth/logout`
    },
    revision: {
        motivos: `${API_URL}/revision/motivos`,
        respsoc: `${API_URL}/revision/resociales`,
        docente: {
            get: `${API_URL}/revision/docente`,
            pendientes: `${API_URL}/revision/pendientes`,
            aprobar: `${API_URL}/revision/aprobar`,
            solicitudes: `${API_URL}/revision/pendientes`,
            agregar: `${API_URL}/revision/crear`,
        },
        estudiante: {
            get: `${API_URL}/revision/estudiante`,
            solicitar: `${API_URL}/revision/solicitar`,
            evaluaciones: `${API_URL}/revision/evaluaciones`
        }
    },
    evaluacion: {
        docente: {
            getEvaluaciones: `${API_URL}/evaluacion/docente`,
            crear: `${API_URL}/evaluacion/crear`,
            marcarAsis: `${API_URL}/evaluacion/marcar-asistencia`,
            regNota: `${API_URL}/evaluacion/registrar-nota`,
            getSolicitudDifRep: `${API_URL}/evaluacion/solicitudes-diferido-repetido`,
            aprobarDifRep: `${API_URL}/evaluacion/aprobar-diferido-repetido`,
            solImp: `${API_URL}/evaluacion/solicitar-impresion`,
        },
        estudiante: {
            getEvaluaciones: `${API_URL}/evaluacion/estudiante`,
            solicitarDifRep: `${API_URL}/evaluacion/solicitar-diferido-repetido`,
        },
        impresor: {
            getSolicitudes: `${API_URL}/evaluacion/pendientes`,
            aprobar: `${API_URL}/evaluacion/aprobar-impresion`,
            impresion: `${API_URL}/evaluacion/imprimir`,
        }
    }
    
}