import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import {TextInput, Snackbar} from 'react-native-paper';
import { authService } from '../../services/authService';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Correo Inválido').required('Required'),
  carnet: Yup.string().required('Required')
    .matches(/^[a-zA-Z]{2}[0-9]{5}$/, 'Carnet Inválido')
    .min(7, 'Carnet Inválido')
    .max(7, 'Carnet Inválido'),
  nombres: Yup.string().required('Required'),
  apellidos: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const registrarse = async (values) => {
    const {email, password, nombres, apellidos, carnet} = values;
    const data = {
        email,
        password,
        nombres,
        apellidos,
        carnet,
    };
    let response = await authService.register(data);
    console.log(response);
    return response;
}

export function CrearUsuario({navigation, route}) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const onDismissSnackBar = () => setVisible(false);

  return (
    <>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Formik
          initialValues={{email: '', password: ''}}
          validationSchema={LoginSchema}
          onSubmit={async (values, {setSubmitting}) => {
            console.log(values);
            let response = await registrarse(values);
            setMessage(response.message);
            setVisible(true);
            setSubmitting(false);

            setTimeout(() => {
                setVisible(false);
                navigation.navigate('Login');
            }, 3000);
          }}>
          {formik => (
            <View style={{gap: 15, width: '90%'}}>
              <TextInput
                mode="outlined"
                placeholder="Nombres"
                onChangeText={formik.handleChange('nombres')}
                onBlur={formik.handleBlur('nombres')}
                value={formik.values.nombres}
              />
              {formik.touched.nombres && formik.errors.nombres ? (
                <Text>{formik.errors.nombres}</Text>
              ) : null}

              <TextInput
                mode="outlined"
                placeholder="Apellidos"
                onChangeText={formik.handleChange('apellidos')}
                onBlur={formik.handleBlur('apellidos')}
                value={formik.values.apellidos}
              />
              {formik.touched.apellidos && formik.errors.apellidos ? (
                <Text>{formik.errors.apellidos}</Text>
              ) : null}

              <TextInput
                mode="outlined"
                placeholder="Carnet"
                onChangeText={formik.handleChange('carnet')}
                onBlur={formik.handleBlur('carnet')}
                value={formik.values.carnet}
              />

              {formik.touched.carnet && formik.errors.carnet ? (
                <Text>{formik.errors.carnet}</Text>
              ) : null}

              <TextInput
                mode="outlined"
                placeholder="ab12345@ues.edu.sv"
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <Text>{formik.errors.email}</Text>
              ) : null}
              <TextInput
                mode="outlined"
                placeholder="********"
                secureTextEntry={true}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <Text>{formik.errors.password}</Text>
              ) : null}
              <Button
                mode="contained"
                onPress={formik.handleSubmit}
                disabled={formik.isSubmitting || !formik.isValid}
                style={{width: '50%'}}>
                Registrarse
              </Button>
            </View>
          )}
        </Formik>

        <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Ok',
        }}>
        {message}
      </Snackbar>
      </View>
    </>
  );
}
