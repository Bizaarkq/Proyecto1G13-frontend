import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  MD2Colors,
  Card,
  Text,
  Button,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {evaluacionService} from '../../services/evaService';
import {useIsFocused} from '@react-navigation/native';
import {Formik} from 'formik';
import {SelectList} from 'react-native-dropdown-select-list';
import Spinner from 'react-native-loading-spinner-overlay';

const getSolicitudes = async token => {
  const sol = await evaluacionService.getSolImpresion(token);
  return sol;
};

const aprobarImpresion = async (body, token) => {
  const response = await evaluacionService.aprobarImpresion(token, body);
  return response;
};

const imprimir = async (body, token) => {
  const response = await evaluacionService.imprimirEvaluacion(token, body);
  return response;
};

const optionsImp = [
  {key: 1, value: 'Si'},
  {key: 0, value: 'No'},
];

const optionsError = [
  {key: 1, value: 'Papel Agotado'},
  {key: 2, value: 'Toner Agotado'},
  {key: 3, value: 'Problemas técnicos Copiadora'},
  {key: 4, value: 'Problemas técnicos Impresora'},
  {key: 5, value: 'Otros errores'},
];

export function AprobImpresiones({navigation, route}) {
  const [solicitudes, setSolicitudes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const isFocused = useIsFocused();
  const [reload, setReload] = React.useState(false); // para recargar la pantalla
  const [event, setEvent] = React.useState(false); // para recargar la pantalla
  const {user} = route.params;

  useEffect(() => {
    setIsLoading(true);
    getSolicitudes(user).then(response => {
      console.log(response.data);
      setSolicitudes(response.data);
      setSearchMessage(response.message);
      setVisible(true);
      setIsLoading(false);

      setTimeout(() => {
        setVisible(false);
      }, 3000);
    });
  }, [isFocused, reload]);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={{flexDirection: 'column', height: '100%', gap: 15}}>
      <Spinner
        visible={isLoading}
        textContent={'Cargando...'}
        textStyle={{color: '#000'}}
      />
      {isLoading ? (
        <>
        </>
      ) : (
        <>
          {solicitudes?.length &&
            solicitudes.map(e => {
              return (
                <Card key={e.id_impresion} style={{backgroundColor: '#FAFAFA'}}>
                  <Card.Title title={e.evaluacion + ' - ' + e.materia} />
                  <Card.Content>
                    <Text>Cantidad: {e.cantidad}</Text>
                    <Text>Hojas anexas: {e.hojas_anexas ? 'Si' : 'No'}</Text>
                    <Text>Detalles formato: {e.detalles_formato}</Text>
                    <Text>Aprobado: {e.aprobado ? 'Si' : 'No'}</Text>
                    <Text>Impreso: {e.impreso ? 'Si' : 'No'}</Text>
                    {e.codigo_error && (
                      <>
                        <Text>Codigo error: {e.codigo_error}</Text>
                        <Text>Descripcion error: {e.error_impresion}</Text>
                        <Text>Observacion: {e.observacion_error}</Text>
                      </>
                    )}
                    {e.aprobado && !e.impreso && (
                      <>
                        <Formik
                          initialValues={{
                            codigo_error: null,
                            id_impresion: e.id_impresion,
                            impreso: true,
                          }}
                          onSubmit={(values, {setSubmitting}) => {
                            setEvent(true);
                            imprimir(
                              {
                                id_impresion: values.id_impresion,
                                codigo_error: values.codigo_error,
                                impreso: values.impreso,
                              },
                              user,
                            ).then(response => {
                              setSearchMessage(response.message);
                              setVisible(true);

                              setTimeout(() => {
                                setReload(!reload);
                                setEvent(false);
                                setVisible(false);
                              }, 3000);
                            });
                          }}>
                          {formikProps => (
                            <>
                              <Text>Impreso</Text>
                              <SelectList
                                data={optionsImp}
                                save="key"
                                setSelected={item => {
                                  formikProps.setFieldValue('impreso', item);
                                }}
                              />

                              {!formikProps.values.impreso && (
                                <>
                                  <Text>Codigo error</Text>
                                  <SelectList
                                    data={optionsError}
                                    save="key"
                                    setSelected={item => {
                                      formikProps.setFieldValue(
                                        'codigo_error',
                                        item,
                                      );
                                    }}
                                  />
                                  <Text>Observacion</Text>
                                  <TextInput
                                    onChangeText={formikProps.handleChange(
                                      'observacion_error',
                                    )}
                                    value={formikProps.values.observacion_error}
                                  />
                                </>
                              )}

                              <Button
                                disabled={event}
                                onPress={formikProps.handleSubmit}>
                                Enviar
                              </Button>
                            </>
                          )}
                        </Formik>
                      </>
                    )}
                  </Card.Content>
                  <Card.Actions>
                    {!e.aprobado ? (
                      <Button
                        disabled={event}
                        onPress={() => {
                          setEvent(true);
                          aprobarImpresion(
                            {
                              id_impresion: e.id_impresion,
                              aprobado: true,
                            },
                            user,
                          ).then(response => {
                            setSearchMessage(response.message);
                            setVisible(true);

                            setTimeout(() => {
                              setReload(!reload);
                              setEvent(false);
                              setVisible(false);
                            }, 3000);
                          });
                        }}>
                        Aprobar
                      </Button>
                    ) : (
                      <Text>Aprobado</Text>
                    )}
                  </Card.Actions>
                </Card>
              );
            })}
        </>
      )}

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Ok',
        }}>
        {seachMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
