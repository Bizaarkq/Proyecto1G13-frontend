import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  MD2Colors,
  Card,
  Text,
  Button,
  Snackbar,
} from 'react-native-paper';
import {View, StyleSheet, ScrollView} from 'react-native';
import {evaluacionService} from '../../services/evaService';
import {useIsFocused} from '@react-navigation/native';
import {Dayjs} from 'dayjs';
import DocumentPicker, {types} from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const getEvaluciones = async token => {
  const evaluaciones = await evaluacionService.getEvaluaciones(token);
  return evaluaciones;
};

const solicitarDiferir = async (body, token) => {
  const response = await evaluacionService.solicitarDifRep(token, body);
  return response;
};

export function EvaluacionEst({navigation, route}) {
  const [eva, setEva] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const isFocused = useIsFocused();
  const [reload, setReload] = React.useState(false); // para recargar la pantalla
  const [event, setEvent] = React.useState(false); // para recargar la pantalla
  const {user} = route.params;
  const [file, setFile] = React.useState([]);
  const [selectedFile, setSelectedFile] = React.useState(null);

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

  const pickFile = useCallback(async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [types.pdf],
      });
      setSelectedFile(res.name);
      const file = await RNFS.readFile(res.uri, 'base64');
      setFile(file);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled from single doc picker');
      } else {
        throw err;
      }
    }
  }, []);

  return (
    <View style={{flexDirection: 'column', height: '100%', gap: 15}}>
      <ScrollView>
        {isLoading ? (
          <>
            <Text>Cargando...</Text>
            <ActivityIndicator animating={true} color={MD2Colors.red_500} />
          </>
        ) : (
          <>
            {eva.map(e => {
              return (
                <Card
                  key={e.id_evaluacion}
                  style={
                    !!e.nota
                      ? e.nota >= 7
                        ? {backgroundColor: '#E8F5E9'}
                        : {backgroundColor: '#FBE9E7'}
                      : !!e.diferido_repetido
                      ? {backgroundColor: '#FFF8E1'}
                      : {backgroundColor: '#FAFAFA'}
                  }>
                  <Card.Title title={e.nombre + ' - ' + e.materia} />
                  <Card.Content>
                    <Text>Tipo: {e.tipo}</Text>
                    <Text>Fecha: {e.fecha_realizacion}</Text>
                    <Text>Lugar: {e.lugar}</Text>
                    <Text>Ciclo: {e.ciclo}</Text>
                    {e.asistencia && (
                      <Text>Asistencia: {e.asistencia ? 'Si' : 'No'}</Text>
                    )}
                    {e.nota && <Text>Nota: {e.nota}</Text>}
                    {e.es_diferido && <Text>Diferido</Text>}
                    {e.es_repetido && <Text>Repetido</Text>}
                    {e.diferido_repetido && (
                      <Text variant="labelSmall">Solicitud enviada</Text>
                    )}
                  </Card.Content>
                  <Card.Actions>
                    {e?.puede_diferir && (
                      <>
                        <Button
                          disabled={event || file.length === 0}
                          onPress={() => {
                            setEvent(true);
                            solicitarDiferir(
                              {
                                id_evaluacion: e.id_evaluacion,
                                tipo: 'diferido',
                                file: file,
                              },
                              user,
                            ).then(response => {
                              setSearchMessage(response.message);
                              setVisible(true);
                              setFile([]);

                              setTimeout(() => {
                                setReload(!reload);
                                setEvent(false);
                                setVisible(false);
                              }, 3000);
                            });
                          }}>
                          Diferir
                        </Button>
                        <Button
                          disabled={event}
                          onPress={pickFile}
                          mode="contained">
                          Subir archivo
                        </Button>
                      </>
                    )}
                    {e?.puede_repetir && (
                      <>
                        <Button
                          disabled={event || file.length === 0}
                          onPress={() => {
                            setEvent(true);
                            solicitarDiferir(
                              {
                                id_evaluacion: e.id_evaluacion,
                                tipo: 'repetido',
                                file: file,
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
                          Repetir
                        </Button>
                        <Button
                          disabled={event}
                          onPress={pickFile}
                          icon="file-pdf"
                          mode="contained">
                          Subir archivo
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
