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
import {evaluacionService} from '../../services/evaService';
import {useIsFocused} from '@react-navigation/native';
import {Dayjs} from 'dayjs';
import Spinner from 'react-native-loading-spinner-overlay';

const getSolicitudes = async token => {
  const sol = await evaluacionService.getSolicitudesDifRep(token);
  return sol;
};

const aprobarDiferir = async (body, token) => {
  const response = await evaluacionService.aprobarDiffRep(token, body);
  return response;
};

export function AprobDiffRep({navigation, route}) {
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
          {solicitudes?.length && solicitudes.map(e => {
            return (
              <Card key={e.id_solicitud} style={{backgroundColor: '#FAFAFA'}}>
                <Card.Title title={e.carnet + ' - ' + e.materia} />
                <Card.Content>
                  <Text>Evaluacion: {e.evaluacion}</Text>
                  <Text>Tipo: {e.tipo}</Text>
                  <Text>Estudiante: {e.nombres + ' ' + e.apellidos}</Text>
                  <Text>Solicitud: {e.es_diferido ? "Diferido" : "Repetido"}</Text>
                </Card.Content>
                <Card.Actions>
                  {!e.aprobado ? (
                    <Button
                    disabled={event}
                    onPress={() => {
                      setEvent(true);
                      aprobarDiferir(
                        {
                          id_solicitud: e.id_solicitud,
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
                  ) :(
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
