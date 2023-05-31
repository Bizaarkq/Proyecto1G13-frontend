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
import {revisionService} from '../../services/revisionService';
import {useIsFocused} from '@react-navigation/native';

const getSolicitudes = async token => {
  const sols = await revisionService.getSolicitudesDocente(token);
  return sols;
};

export function SolPendientesDoc({navigation, route}) {
  const [solicitudes, setSolicitudes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const isFocused = useIsFocused();
  const {user} = route.params;

  useEffect(() => {
    setIsLoading(true);
    getSolicitudes(user).then(response => {
      setSolicitudes(response.data);
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
    <View style={{flexDirection: 'column', height: '100%', gap: 15}}>
      {isLoading ? (
        <>
          <Text>Cargando...</Text>
          <ActivityIndicator animating={true} color={MD2Colors.red_500} />
        </>
      ) : (
        <>
          <Text variant="headlineMedium">Listado de Solicitudes</Text>
          {solicitudes.lenght && solicitudes.map(e => {
            return (
              <Card key={e.id_sol}>
                <Card.Title title={e.carnet + ' - ' + e.materia} />
                <Card.Content>
                  <Text>Evaluacion: {e.evaluacion}</Text>
                  <Text>Tipo: {e.tipo}</Text>
                  <Text>Fecha: {e.fecha_solicitud}</Text>
                </Card.Content>
                <Card.Actions>
                    <Button
                        onPress={() => {
                            navigation.navigate('DetalleSolicitud', {
                                solicitud: e,
                                user: user,
                            });
                        }}>
                        Ver
                    </Button>
                </Card.Actions>
              </Card>
            );
          })}
          {!solicitudes.length && (
              <>
                <Text>No hay solicitudes pendientes</Text>
              </>
            )}
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
