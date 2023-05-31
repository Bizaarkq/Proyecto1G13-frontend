import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  MD2Colors,
  Card,
  Text,
  Button,
  Snackbar,
} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {revisionService} from '../services/revisionService';
import {useIsFocused} from '@react-navigation/native';

const getRevisiones = async token => {
    const revisiones = await revisionService.getRevisionesDocente(token);
    return revisiones;
}

export function RevisionEstudiante({navigation, route}) {
  const [revisiones, setRevisiones] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const isFocused = useIsFocused();
  const {user} = route.params;

  useEffect(() => {
    setIsLoading(true);
    getRevisiones(user).then(response => {
      setEva(response.data);
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
      <Button
        mode="contained"
        onPress={() => navigation.navigate('SolicitudRevision')}>
        Solicitar
      </Button>
      {isLoading ? (
        <ActivityIndicator animating={true} color={MD2Colors.red_500} />
      ) : (
        <>
          <Text>Listado de Revisiones</Text>
          {revisiones.map(value => {
            return (
              <Card
                key={value.id_sol}
                style={
                  value.estado === 'PENDIENTE'
                    ? {backgroundColor: '#E3F2FD'}
                    : value.estado === 'APROBADA'
                    ? {backgroundColor: '#E8F5E9'}
                    : {backgroundColor: '#FBE9E7'}
                }>
                <Card.Title title={value.nombre + ' - ' + value.codigo} />
                <Card.Content>
                  <Text>Motivo: {value.motivo}</Text>
                  <Text>Fecha de solicitud: {value.fecha_solicitud}</Text>
                  <Text>Estado: {value.estado}</Text>
                  {value.estado === 'APROBADA' && (
                    <>
                      <Text>Fecha de aprobación: {value.fecha_aprobacion}</Text>
                      <Text>Local Destinado: {value.local_destinado}</Text>
                      <Text>
                        Fecha de revisión: {value.fecha_hora_revision}
                      </Text>
                    </>
                  )}
                </Card.Content>
                <Card.Actions>
                  {value.estado !== 'PENDIENTE' && (
                    <Button onPress={() => console.log(value)}>
                      Ver Detalles
                    </Button>
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
