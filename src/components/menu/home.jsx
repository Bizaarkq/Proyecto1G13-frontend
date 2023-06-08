import {View, ScrollView} from 'react-native';
import {Button, Card, Snackbar, Text, TextInput} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {adminService} from '../../services/adminService';
import {Formik} from 'formik';
import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';

const opciones = [
  {
    id: 1,
    titulo: 'Revision',
    router: 'RevisionEstudiante',
    descripcion: 'Revisar las evaluaciones',
  },
  {
    id: 2,
    titulo: 'Evaluaciones',
    router: 'EvaluacionesEstudiante',
    descripcion: 'Revisar las evaluaciones',
  },
];

export function HomeEstudiante({navigation, route}) {
  const {user} = route.params;
  const theme = useTheme();
  return (
    <View style={{gap: 15}}>
      <Text variant="headlineMedium">Carnet: {user.carnet}</Text>
      {opciones.map(opcion => {
        return (
          <Card key={opcion.id} style={{backgroundColor: theme.colors.surface}}>
            <Card.Title title={opcion.titulo} />
            <Card.Content>
              <Text>{opcion.descripcion}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate(opcion.router)}>
                Ir
              </Button>
            </Card.Actions>
          </Card>
        );
      })}
    </View>
  );
}

const opcionesDocente = [
  {
    id: 1,
    titulo: 'Revision',
    route: 'RevisionDocente',
    descripcion: 'Revisar las evaluaciones',
  },
  {
    id: 2,
    titulo: 'Solicitudes de revision',
    route: 'SolicitudesRevisionDocente',
    descripcion: 'Aprobar o rechazar solicitudes de revisión',
  },
  {
    id: 3,
    titulo: 'Solicitudes diferidos/repetidos',
    route: 'AprobarDiffRep',
    descripcion: 'Aprobar o rechazar solicitudes de diferidos/repetidos',
  },
  {
    id: 4,
    titulo: 'Solicitar impresión',
    route: 'SolicitudImpresion',
    descripcion: 'Solicitar impresión de evaluaciones',
  },
];

export function HomeDocente({navigation, route}) {
  const {user} = route.params;
  const theme = useTheme();
  return (
    <View style={{gap: 15}}>
      {opcionesDocente.map(opcion => {
        return (
          <Card key={opcion.id} style={{backgroundColor: theme.colors.surface}}>
            <Card.Title title={opcion.titulo} />
            <Card.Content>
              <Text>{opcion.descripcion}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate(opcion.route)}>
                Ir
              </Button>
            </Card.Actions>
          </Card>
        );
      })}
    </View>
  );
}

export function HomeImpresor({navigation, route}) {
  const {user} = route.params;
  const theme = useTheme();
  return (
    <View style={{gap: 15}}>
      <Card style={{backgroundColor: theme.colors.surface}}>
        <Card.Title title="Impresiones" />
        <Card.Content>
          <Text>Revisar las solicitudes de impresión</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('RevisionImpresor')}>
            Ir
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const opcionesCoord = [
  {
    id: 1,
    titulo: 'Revision',
    route: 'RevisionDocente',
    descripcion: 'Revisar las evaluaciones',
  },
  {
    id: 2,
    titulo: 'Solicitudes de revision',
    route: 'SolicitudesRevisionDocente',
    descripcion: 'Aprobar o rechazar solicitudes de revisión',
  },
  {
    id: 3,
    titulo: 'Solicitudes diferidos/repetidos',
    route: 'AprobarDiffRep',
    descripcion: 'Aprobar o rechazar solicitudes de diferidos/repetidos',
  },
  {
    id: 4,
    titulo: 'Solicitar impresión',
    route: 'SolicitudImpresion',
    descripcion: 'Solicitar impresión de evaluaciones',
  },
  {
    id: 5,
    titulo: 'Solicitudes de registro',
    route: 'AprobRegistro',
    descripcion: 'Aprobar o rechazar solicitudes de registro'
  }
];

export function HomeCoordinador({navigation, route}) {
  const {user} = route.params;
  const theme = useTheme();
  return (
    <View style={{gap: 15}}>
      {opcionesCoord.map(opcion => {
        return (
          <Card key={opcion.id} style={{backgroundColor: theme.colors.surface}}>
            <Card.Title title={opcion.titulo} />
            <Card.Content>
              <Text>{opcion.descripcion}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate(opcion.route)}>
                Ir
              </Button>
            </Card.Actions>
          </Card>
        );
      })}
    </View>
  );
}

export function HomeAdmin({navigation, route}) {
  const {user} = route.params;
  const theme = useTheme();
  const [configuracion, setConfiguracion] = useState([]);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    setLoading(true);
    adminService.getConfig(user).then(response => {
      setConfiguracion(response.data);
      setLoading(false);
    });
  }, [reload]);

  return (
    <View style={{gap: 15, flexDirection: 'column', height: '100%' }}>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <>
          {configuracion.length ? (
            configuracion.map(opcion => {
              return (
                <>
                  <Card
                    key={opcion.id_conf}
                    style={{backgroundColor: theme.colors.surface}}>
                    <Card.Title title={opcion.codigo} />
                    <Card.Content>
                      <Text>Valor Actual: {opcion.valor_fijo}</Text>

                      <Formik
                        initialValues={{
                          id_conf: opcion.id_conf,
                          valor: '',
                        }}
                        onSubmit={async (values, {setSubmitting}) => {
                          setSubmitting(true);
                          let response = await adminService.setConfig(user, {
                            id_conf: values.id_conf,
                            valor: values.valor,
                          });
                          setSearchMessage(response.message);
                          setVisible(true);

                          setTimeout(() => {
                            setVisible(false);
                            if (response.success) {
                              setReload(!reload);
                            }
                          }, 3000);
                          setSubmitting(false);
                        }}>
                        {formikProps => (
                          <View>
                            <TextInput
                              label="Nuevo valor"
                              onChangeText={formikProps.handleChange('valor')}
                              value={formikProps.values.valor}
                            />
                            <Button
                              mode="contained"
                              disabled={formikProps.isSubmitting}
                              onPress={formikProps.handleSubmit}>
                              Guardar
                            </Button>
                          </View>
                        )}
                      </Formik>
                    </Card.Content>
                  </Card>
                  <Snackbar
                    key={'snackbar'}
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    action={{
                      label: 'Ok',
                    }}>
                    {seachMessage}
                  </Snackbar>
                </>
              );
            })
          ) : (
            <Text>No hay configuraciones</Text>
          )}
        </>
      )}
    </View>
  );
}
