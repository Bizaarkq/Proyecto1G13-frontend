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
import {View, StyleSheet} from 'react-native';
import {revisionService} from '../../services/revisionService';
import {SelectList} from 'react-native-dropdown-select-list';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {TimePickerModal} from 'react-native-paper-dates';
import {DatePickerModal} from 'react-native-paper-dates';
import dayjs from 'dayjs';

const aprobarSolicitud = async (token, body) => {
  const res = await revisionService.aprobarSolicitud(token, body);
  return res;
};

const solSchema = Yup.object().shape({
  id_sol: Yup.string(),
  decision: Yup.boolean(),
  local: Yup.string(),
  fecha: Yup.string(),
  hora: Yup.string(),
});

const opciones = [
  {key: true, value: 'Aprobar'},
  {key: false, value: 'Rechazar'},
];

export function DetalleSolicitud({navigation, route}) {
  const {solicitud: sol, user} = route.params;
  const [snack, setSnack] = React.useState(false);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  const onDismissSnackBar = () => setSnack(false);

  return (
    <>
      <View style={{margin: 10, flexDirection: 'column', height: '100%'}} >
        <Text variant="labelLarge">
          Estudiante: {sol.nombres + ' ' + sol.apellidos}
        </Text>
        <Text variant="labelLarge">Carnet: {sol.carnet}</Text>
        <Text variant="labelLarge">Evaluacion: {sol.evaluacion}</Text>
        <Text variant="labelLarge">Tipo: {sol.tipo}</Text>
        <Text variant="labelLarge">Materia: {sol.materia}</Text>
        <Text variant="labelLarge">Fecha: {sol.fecha_solicitud}</Text>
        <Text variant="labelLarge">Estado: {sol.estado}</Text>
        <Text variant="labelLarge">Motivo: {sol.motivo}</Text>

        <View style={{marginTop: 10}}>
          <Formik
            initialValues={{
              id_sol: sol.id_sol,
              decision: false,
              local: '',
              fecha: '',
              hora: '',
            }}
            validationSchema={solSchema}
            onSubmit={(values, {setSubmitting}) => {
              console.log('values: ', values);
              let body =
                values.fecha && values.hora
                  ? {
                      id_sol: values.id_sol,
                      decision: values.decision,
                      local: values.local,
                      fecha: values.fecha + ' ' + values.hora + ':00',
                    }
                  : {
                      id_sol: values.id_sol,
                      decision: values.decision,
                    };
              aprobarSolicitud(user, body).then(res => {
                console.log('res: ', res);
                setSubmitting(false);
                if (res.success) {
                    setSnack(true);
                    setSearchMessage(res.message);
                    setTimeout(() => {
                        navigation.navigate('SolicitudesRevisionDocente');
                    }, 3000);
                }
              });
            }}>
            {formikProps => (
              <>
                <View>
                  <SelectList
                    setSelected={itemValue => {
                      formikProps.setFieldValue('decision', itemValue);
                    }}
                    data={opciones}
                    save="key"
                  />
                  <TextInput
                    label="Local"
                    style={{marginTop: 10}}
                    onChangeText={formikProps.handleChange('local')}
                    onBlur={formikProps.handleBlur('local')}
                    value={formikProps.values.local}
                    error={formikProps.errors.local}
                  />
                  <TextInput
                    label="Fecha"
                    style={{marginTop: 10}}
                    onChangeText={formikProps.handleChange('fecha')}
                    onBlur={formikProps.handleBlur('fecha')}
                    value={formikProps.values.fecha}
                    error={formikProps.errors.fecha}
                  />
                  <TextInput
                    label="hora"
                    style={{marginTop: 10}}
                    onChangeText={formikProps.handleChange('hora')}
                    onBlur={formikProps.handleBlur('hora')}
                    value={formikProps.values.hora}
                    error={formikProps.errors.hora}
                  />

                  <View style={{marginTop: 10}}>
                    <Button
                      onPress={() => setOpen(true)}
                      uppercase={false}
                      mode="outlined">
                      Fecha de Revision
                    </Button>
                    <DatePickerModal
                      locale="en"
                      mode="single"
                      visible={open}
                      onDismiss={onDismissSingle}
                      date={formikProps.values.fecha}
                      onConfirm={params => {
                        console.log('params: ', params);
                        formikProps.setFieldValue(
                          'fecha',
                          dayjs(params.date).format('YYYY-MM-DD'),
                        );
                        setOpen(false);
                      }}
                    />

                    <Button
                      onPress={() => setVisible(true)}
                      style={{marginTop: 10}}
                      uppercase={false}
                      mode="outlined">
                      Hora de Revision
                    </Button>
                    <TimePickerModal
                      visible={visible}
                      onDismiss={onDismiss}
                      onConfirm={({hours, minutes}) => {
                        formikProps.setFieldValue(
                          'hora',
                          `${('0' + hours).slice(-2)}:${('0' + minutes).slice(
                            -2,
                          )}`,
                        );
                        setVisible(false);
                      }}
                      hours={12}
                      minutes={14}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Button
                    mode="contained"
                    onPress={formikProps.handleSubmit}
                    disabled={formikProps.isSubmitting}
                    style={{marginTop: 10}}>
                    Enviar
                  </Button>
                  {formikProps.isSubmitting && (
                    <ActivityIndicator
                      style={{marginLeft: 10}}
                      animating={true}
                      color={MD2Colors.red_500}
                    />
                  )}
                </View>
              </>
            )}
          </Formik>
        </View>
        <Snackbar
          visible={snack}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Ok',
          }}>
          {seachMessage}
        </Snackbar>
      </View>
    </>
  );
}
