import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {revisionService} from '../../services/revisionService';

const revSchema = Yup.object().shape({
  carnet: Yup.string().required('Campo requerido'),
  respsociedad: Yup.string().nullable(),
  cod_motivo: Yup.string().required('Campo requerido'),
  nueva_nota: Yup.number(),
  id_sol: Yup.string(),
});

const getMotivosCambios = async token => {
  const motivos = await revisionService.getMotivosCambios(token);
  return motivos;
};

const getResponsableSoc = async token => {
  const resp = await revisionService.getResponsableSoc(token);
  return resp;
};

const setRevision = async (token, body) => {
  const rev = await revisionService.agregarRevision(token, body);
  return rev;
};

export function RevisionDetalle({navigation, route}) {
  const {sol, user} = route.params;
  const [resp, setResp] = useState([]);
  const [motivos, setMotivos] = useState([]); // [{value: 'motivo', key: 'id_motivo'}
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(user);
    getResponsableSoc(user).then(resp => {
      let map = resp.map(r => {
        return {
          value: `${r.carnet}: ${r.nombres} - ${r.apellidos}`,
          key: r.carnet,
        };
      });

      setResp(map);
    });
    getMotivosCambios(user).then(motivos => {
      let map = motivos.map(motivo => {
        return {
          value: motivo.nombre,
          key: motivo.cod_motivo,
        };
      });
      setMotivos(map);
    });
    
  }, []);

  return (
    <>
      <Text>Estudiante: {sol.nombres + ' ' + sol.apellidos}</Text>
      <Text>Nota actual: {sol.nota_original}</Text>
      <Text>Tipo: {sol.tipo}</Text>
      <Text>Materia: {sol.materia}</Text>
      <Text>Fecha de solicitud: {sol.fecha_solicitud}</Text>
      <Text>Motivo: {sol.motivo}</Text>
      <Formik
        initialValues={{
          carnet: sol.carnet,
          respsociedad: null,
          cod_motivo: '',
          nueva_nota: sol.nota_original,
          id_sol: sol.id_sol,
        }}
        validationSchema={revSchema}
        onSubmit={async (values, {setSubmitting}) => {
          values = {
            ...values,
            nueva_nota: values.nueva_nota < sol.nota_original ? sol.nota_original : values.nueva_nota,
          }
          const solicitud = await setRevision(user, values);
          console.log(solicitud);
          setSuccess(solicitud.success);
          setMessage(solicitud.message);
          setSubmitting(false);

          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        }}>
        {formik => (
          <View>
            <Text>Motivo del cambio</Text>
            <SelectList
              setSelected={itemValue => {
                formik.setFieldValue('cod_motivo', itemValue);
              }}
              data={motivos}
              save="key"
            />
            {formik.touched.cod_motivo && formik.errors.cod_motivo ? (
              <Text>{formik.errors.cod_motivo}</Text>
            ) : null}

            <Text>Responsable de la sociedad de estudiantes (si aplica)</Text>
            <SelectList
              setSelected={itemValue => {
                formik.setFieldValue('respsociedad', itemValue);
              }}
              data={resp}
              save="key"
            />
            {formik.touched.respsociedad && formik.errors.respsociedad ? (
              <Text>{formik.errors.respsociedad}</Text>
            ) : null}

            <Text>Nueva nota</Text>
            <TextInput
              mode="outlined"
              placeholder="Motivo"
              multiline={true}
              onChangeText={formik.handleChange('nueva_nota')}
              onBlur={formik.handleBlur('nueva_nota')}
              value={formik.values.nueva_nota}
            />
            {formik.touched.nueva_nota && formik.errors.nueva_nota ? (
              <Text>{formik.errors.nueva_nota}</Text>
            ) : null}

            <Button
              mode="contained"
              onPress={formik.handleSubmit}
              disabled={formik.isSubmitting}>
              Enviar Solicitud
            </Button>

            {formik.isSubmitting && <Text>Enviando solicitud...</Text>}

            {success && <Text>{message}</Text>}
          </View>
        )}
      </Formik>
    </>
  );
}
