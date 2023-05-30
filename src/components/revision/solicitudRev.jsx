import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Select, NativeBaseProvider, Box} from 'native-base';
import {SelectList} from 'react-native-dropdown-select-list';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {revisionService} from '../../services/revisionService';

const SolicitudSchema = Yup.object().shape({
  id_evaluacion: Yup.string().required('Required'),
  motivo: Yup.string().required('Required'),
});

const getEvaluaciones = async token => {
  const evaluaciones = await revisionService.getEvaluaciones(token);
  return evaluaciones;
};

const solicitarRevision = async (token, id_evaluacion, motivo) => {
  const solicitud = await revisionService.solicitarRevision(token, {
    id_evaluacion,
    motivo,
  });
  return solicitud;
};
export function SolicitudRevision({navigation, route}) {
  const {user} = route.params;
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(user);
    getEvaluaciones(user).then(evaluaciones => {
      console.log(evaluaciones);
      let map = evaluaciones.map(evaluacion => {
        return {
          value: `${evaluacion.nombre} - ${evaluacion.codigo}`,
          key: evaluacion.id_evaluacion,
        };
      });

      setEvaluaciones(map);
    });
  }, []);

  return (
    <Formik
      initialValues={{id_evaluacion: '', motivo: ''}}
      validationSchema={SolicitudSchema}
      onSubmit={async (values, {setSubmitting}) => {
        const solicitud = await solicitarRevision(
          user,
          values.id_evaluacion,
          values.motivo,
        );
        console.log(solicitud);
        setSuccess(solicitud.success);
        setMessage(solicitud.message);
        setSubmitting(false);

        setTimeout(() => {
            navigation.navigate('RevisionEstudiante');
        }, 2000);
      }}>
      {formik => (
        <View>
          <Text>Seleccione la evaluación</Text>
          <SelectList
            setSelected={itemValue => {
              formik.setFieldValue('id_evaluacion', itemValue);
            }}
            data={evaluaciones}
            save="key"
          />
          {formik.touched.id_evaluacion && formik.errors.id_evaluacion ? (
            <Text>{formik.errors.id_evaluacion}</Text>
          ) : null}

          <Text>Motivo de la solicitud</Text>
          <TextInput
            mode="outlined"
            placeholder="Motivo"
            multiline={true}
            onChangeText={formik.handleChange('motivo')}
            onBlur={formik.handleBlur('motivo')}
            value={formik.values.motivo}
          />
          {formik.touched.motivo && formik.errors.motivo ? (
            <Text>{formik.errors.motivo}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={formik.handleSubmit}
            disabled={formik.isSubmitting}>
            Enviar Solicitud
          </Button>
          
          {formik.isSubmitting && (
            <Text>Enviando solicitud...</Text>
          )}

          {success && ( 
            <Text>{message}</Text>
          )}
        </View>
      )}
    </Formik>
  );
}
