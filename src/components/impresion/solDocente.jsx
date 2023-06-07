import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  MD2Colors,
  Card,
  Text,
  Button,
  Snackbar,
  TextInput,
  Switch 
} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';
import {View, StyleSheet, ScrollView} from 'react-native';
import {evaluacionService} from '../../services/evaService';
import {useIsFocused} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Spinner from 'react-native-loading-spinner-overlay';

const getEvaluciones = async token => {
  const evaluaciones = await evaluacionService.getEvaDocente(token);
  return evaluaciones;
};

const solicitarImp = async (body, token) => {
  const response = await evaluacionService.solicitarImp(token, body);
  return response;
};

const impSchema = Yup.object().shape({
  id_evaluacion: Yup.number(),
  cantidad: Yup.number().required('La cantidad es requerida'),
  hojas_anexas: Yup.boolean().required('Las hojas anexas son requeridas'),
  detalles_formato: Yup.string().required(
    'Los detalles del formato son requeridos',
  ),
});

const options = [
    {key: true, value: 'Si'},
    {key: false, value: 'No'},
]


export function EvaluacionesDocente({navigation, route}) {
  const [eva, setEva] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const isFocused = useIsFocused();
  const [reload, setReload] = React.useState(false); // para recargar la pantalla
  const [event, setEvent] = React.useState(false); // para recargar la pantalla
  const {user} = route.params;

  useEffect(() => {
    setIsLoading(true);
    getEvaluciones(user).then(response => {
      setEva(response.data);
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
      <ScrollView style={{gap: 15}}>
        {isLoading ? (
          <>
          </>
        ) : (
          <>
            {eva.length &&
              eva.map(e => {
                return (
                  <Card
                    key={e.id_evaluacion}
                    style={{backgroundColor: '#FAFAFA'}}>
                    <Card.Title title={e.evaluacion + ' - ' + e.materia} />
                    <Card.Content>
                      <Text>Tipo: {e.tipo}</Text>
                      <Text>Fecha: {e.fecha_realizacion}</Text>
                      <Text>Fecha Publicacion: {e.fecha_publicacion}</Text>
                      <Text>Lugar: {e.lugar}</Text>
                      {e.es_diferido && (
                        <Text variant="labelSmall">Diferido</Text>
                      )}
                      {e.es_repetido && (
                        <Text variant="labelSmall">Repetido</Text>
                      )}
                      {e.id_impresion ? (
                        <>
                          <Text variant="labelSmall">Impresion</Text>
                          <Text>Cantidad: {e.cantidad}</Text>
                          <Text>Hojas anexas: {e.hojas_anexas}</Text>
                          <Text>Detalles formato: {e.detalles_formato}</Text>
                          {e.codigo_error && (
                            <>
                              <Text variant="labelSmall">Error</Text>
                              <Text>Codigo: {e.codigo_error}</Text>
                              <Text>Descripcion: {e.error_impresion}</Text>
                              <Text>Observacion: {e.observacion_error}</Text>
                            </>
                          )}
                          {e.aprobado && (
                            <Text>
                              estado:{' '}
                              {e.aprobado && !e.impreso
                                ? 'Pendiente de impresión'
                                : 'Impreso'}
                            </Text>
                          )}
                        </>
                      ) : (
                        <>
                          <Text variant="labelSmall">Solicitar Impresion</Text>
                          <Formik
                            initialValues={{
                              id_evaluacion: e.id_evaluacion,
                              cantidad: 0,
                              hojas_anexas: false,
                              detalles_formato: '',
                            }}
                            onSubmit={(values, {setSubmitting, resetForm}) => {
                              solicitarImp(values, user).then(response => {
                                setSearchMessage(response.message);
                                setVisible(true);
                                setReload(!reload);
                                resetForm();
                                setSubmitting(false);
                                setTimeout(() => {
                                  setVisible(false);
                                }, 3000);
                              });
                            }}
                            validationSchema={impSchema}>
                            {formikProps => (
                              <View>
                                <Text>Cantidad</Text>
                                <TextInput
                                  style={styles.input}
                                  onChangeText={formikProps.handleChange(
                                    'cantidad',
                                  )}
                                  onBlur={formikProps.handleBlur('cantidad')}
                                  value={formikProps.values.cantidad}
                                  keyboardType="numeric"
                                />
                                <Text style={styles.error}>
                                  {formikProps.touched.cantidad &&
                                    formikProps.errors.cantidad}
                                </Text>
                                <Text>Hojas anexas</Text>
                                <SelectList
                                    data={options}
                                    save='key'
                                    setSelected={ item => {
                                        formikProps.setFieldValue('hojas_anexas', item)
                                    }}
                                />
                                <Text style={styles.error}>
                                  {formikProps.touched.hojas_anexas &&
                                    formikProps.errors.hojas_anexas}
                                </Text>
                                <Text>Detalles formato</Text>
                                <TextInput
                                  style={styles.input}
                                  onChangeText={formikProps.handleChange(
                                    'detalles_formato',
                                  )}
                                  onBlur={formikProps.handleBlur(
                                    'detalles_formato',
                                  )}
                                  value={formikProps.values.detalles_formato}
                                />
                                <Text style={styles.error}>
                                  {formikProps.touched.detalles_formato &&
                                    formikProps.errors.detalles_formato}
                                </Text>
                                <Button
                                  mode="contained"
                                  onPress={formikProps.handleSubmit}
                                  disabled={
                                    !formikProps.isValid ||
                                    formikProps.isSubmitting
                                  }>
                                  Solicitar
                                </Button>
                              </View>
                            )}
                          </Formik>
                        </>
                      )}
                    </Card.Content>
                  </Card>
                );
              })}
          </>
        )}
      </ScrollView>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
  },
});
