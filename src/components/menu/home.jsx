import {View} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import { useTheme } from 'react-native-paper';

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
    <View>
      <Text>Carnet: {user.carnet}</Text>
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
    titulo: 'Evaluaciones',
    route: 'EvaluacionesDocente',
    descripcion: 'Revisar las evaluaciones',
  },
  {
    id: 3,
    titulo: 'Crear evaluacion',
    route: 'CrearEvaluacion',
    descripcion: 'Crear una evaluacion',
  },
  {
    id: 4,
    titulo: 'Solicitar impresión',
    route: 'SolicitudImpresion',
    descripcion: 'Solicitar impresión de evaluaciones'
  }
];

export function HomeDocente({navigation, route}) {
  const {user} = route.params;
  const theme = useTheme();
  return (
    <View>
      {opcionesDocente.map(opcion => {
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