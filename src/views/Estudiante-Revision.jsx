import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  MD2Colors,
  Card,
  Text,
  Button,
  Snackbar,
} from 'react-native-paper';
import {View, StyleSheet } from 'react-native';
import {revisionService} from '../services/revisionService';

export function RevisionEstudiante({navigation, route}) {
  const [revisiones, setRevisiones] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const {user} = route.params;

  useEffect(() => {
    const getRevisiones = async () => {
      console.log(user);
      const revisiones = await revisionService.getRevisions(user);

      console.log('revisiones', revisiones);
      setRevisiones(revisiones.revisiones);
      setSearchMessage(revisiones.message);
      setVisible(true);
      setIsLoading(false);

      setTimeout(() => {
        setVisible(false);
      }, 3000);
    };
    getRevisiones();
  }, []);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View>
      <Button onPress={() => navigation.navigate("SolicitudRevision")}>Solicitar</Button>
      {isLoading ? (
        <ActivityIndicator animating={true} color={MD2Colors.red_500} />
      ) : (
        <>
          <Text>Listado de Revisiones</Text>
          {revisiones.map((key, value) => {
            return (
              <Card key={value.id}>
                <Card.Title title={key} />
                <Card.Content>
                  <Text>{value.cod_motivo}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => console.log(value)}>
                    Ver Detalles
                  </Button>
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