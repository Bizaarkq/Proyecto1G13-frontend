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
import {View, StyleSheet, ScrollView} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Formik} from 'formik';
import { authService } from '../../services/authService';

const getSolicitudes = async token => {
  const sol = await authService.solicitudes(token);
  return sol;
};

const aprobar = async (body, token) => {
  const response = await authService.aprobarRegistro(token, body);
  return response;
};

export function AprobRegistro({navigation, route}) {
  const [solicitudes, setSolicitudes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const isFocused = useIsFocused();
  const [reload, setReload] = React.useState(false); // para recargar la pantalla
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
      {isLoading ? (
        <>
          <Text>Cargando...</Text>
          <ActivityIndicator animating={true} color={MD2Colors.red_500} />
        </>
      ) : (
        <>
        <ScrollView style={{gap: 20}}>
          {solicitudes?.length &&
            solicitudes.map(e => {
              return (
                <Card key={e.id} style={{backgroundColor: '#FAFAFA'}}>
                  <Card.Title title={e.carnet} />
                  <Card.Content>
                    <Text>Carnet: {e.carnet}</Text>
                    <Text>
                      Nombre completo: {e.nombres + ' ' + e.apellidos}
                    </Text>
                    <Text>Correo: {e.email}</Text>
                    <Text>estado: {e.estado}</Text>
                  </Card.Content>
                  <Card.Actions>
                    {e.estado === 'PENDIENTE' ? (
                      <Formik
                        initialValues={{
                          id: e.id,
                          aprobado: false,
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                          console.log(values);
                          aprobar(values, user).then(response => {
                            setSearchMessage(response.message);
                            setVisible(true);
                            setSubmitting(false);

                            setTimeout(() => {
                              setReload(!reload);
                              setVisible(false);
                            }, 3000);
                          });
                        }}>
                        {props => (
                          <>
                            <Button
                              disabled={props.isSubmitting}
                              onPress={() => {
                                props.setFieldValue('aprobado', false);
                                props.handleSubmit();
                              }}>
                              Rechazar
                            </Button>
                            <Button
                              disabled={props.isSubmitting}
                              onPress={() => {
                                props.setFieldValue('aprobado', true);
                                props.handleSubmit();
                              }}>
                              Aprobar
                            </Button>
                          </>
                        )}
                      </Formik>
                    ) : (
                      <Text>{e.estado}</Text>
                    )}
                  </Card.Actions>
                </Card>
              );
            })}
          </ScrollView>
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
