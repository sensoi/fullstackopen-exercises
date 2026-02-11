import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ThemedText } from './themed-text';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
});

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 4,
    padding: 12,
    marginBottom: 6,
  },
  errorText: {
    color: '#d73a4a',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0366d6',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const SignInContainer = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        isValid,
      }) => (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={values.username}
            onChangeText={handleChange('username')}
          />
          {touched.username && errors.username && (
            <ThemedText style={styles.errorText}>
              {errors.username}
            </ThemedText>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange('password')}
          />
          {touched.password && errors.password && (
            <ThemedText style={styles.errorText}>
              {errors.password}
            </ThemedText>
          )}

          <Pressable
            style={[
              styles.button,
              !isValid && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <ThemedText style={styles.buttonText}>
              Sign in
            </ThemedText>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};

export default SignInContainer;
