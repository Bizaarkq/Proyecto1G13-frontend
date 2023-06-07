import React, {useContext} from 'react';
import {AuthContext} from '../../../App';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import {TextInput} from 'react-native-paper';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Correo Inválido').required('Required'),
  password: Yup.string().required('Required'),
});

function Login({navigation, route}) {
  const {signIn} = useContext(AuthContext);

  return (
    <>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={async (values, {setSubmitting}) => {
          await signIn(values);
          setSubmitting(false);
        }}>
        {formik => (
          <View style={{gap: 15, display: 'flex'}}>
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
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Button
                mode="contained"
                onPress={() => {
                  navigation.navigate('CrearUsuario');
                }}
                style={{width: '40%'}}>
                Crear Usuario
              </Button>
              <Button
                mode="contained"
                onPress={formik.handleSubmit}
                style={{width: '40%'}}>
                Iniciar Sesión
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </>
  );
}

export default Login;
