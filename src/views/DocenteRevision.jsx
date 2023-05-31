import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  MD2Colors,
  Card,
  Text,
  Button,
  Snackbar,
} from 'react-native-paper';
import {View, ScrollView, StyleSheet} from 'react-native';
import {revisionService} from '../services/revisionService';
import {useIsFocused} from '@react-navigation/native';

const getRevisiones = async token => {
  const revisiones = await revisionService.getRevisionesDocente(token);
  return revisiones;
};

export function RevisionesDocente({navigation, route}) {
  const [revisiones, setRevisiones] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const isFocused = useIsFocused();
  const {user} = route.params;

  useEffect(() => {
    setIsLoading(true);
    getRevisiones(user).then(response => {
      setRevisiones(response.data);
      setSearchMessage(response.message);
      setVisible(true);
      setIsLoading(false);

      setTimeout(() => {
        setVisible(false);
      }, 3000);
    });
  }, [isFocused]);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={{flexDirection: 'column', height: '100%'}}>
      <View style={{height: "90%"}}>
      <ScrollView>
        {isLoading ? (
          <>
            <Text>Cargando...</Text>
            <ActivityIndicator animating={true} color={MD2Colors.red_500} />
          </>
        ) : (
          <>
            <Text>Listado de Revisiones</Text>
            {revisiones.map(value => {
              return (
                <Card
                  key={value.id_sol}
                  style={
                    !value.id
                      ? {backgroundColor: '#F5F5F5'}
                      : {backgroundColor: '#E8F5E9'}
                  }>
                  <Card.Title title={value.carnet + ' - ' + value.materia} />
                  <Card.Content>
                    <Text>
                      Estudiante: {value.nombres + ' ' + value.apellidos}
                    </Text>
                    <Text>Nota actual: {value.nota_original}</Text>
                    <Text>Tipo: {value.tipo}</Text>
                    <Text>Materia: {value.materia}</Text>
                    <Text>Fecha de solicitud: {value.fecha_solicitud}</Text>
                    <Text>Estado: {value.id ? 'Revisado' : 'Pendiente'}</Text>
                    <Text>Motivo: {value.motivo}</Text>

                    {value.id && (
                      <>
                        <Text>Nueva nota: {value.nueva_nota}</Text>
                        <Text>Motivo cambio: {value.motivo_cambio}</Text>
                        <Text>
                          Descripción del cambio: {value.descripcion_cambio}
                        </Text>
                        <Text>
                          Docente:{' '}
                          {value.docente_nombre + ' ' + value.docente_apellido}
                        </Text>
                        <Text>Fecha de revisión: {value.fecha_revision}</Text>
                        {value.respsoc_nombre && (
                          <>
                            <Text>
                              Responsable de sociedad de estudiantes:{' '}
                              {value.respsoc_nombre +
                                ' ' +
                                value.respsoc_apellido}
                            </Text>
                          </>
                        )}
                      </>
                    )}
                  </Card.Content>
                  <Card.Actions>
                    {!value.id && (
                      <>
                        <Button
                          onPress={() =>
                            navigation.navigate('RevisionDetalle', {
                              sol: value,
                              user: user,
                            })
                          }>
                          Revisar
                        </Button>
                      </>
                    )}
                  </Card.Actions>
                </Card>
              );
            })}
          </>
        )}
        </ScrollView>
        </View>

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
