import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ThemedText } from './themed-text';

const PLACEHOLDER_COLOR = '#6e7781';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(5, 'Username must be at least 5 characters')
    .max(30, 'Username must be at most 30 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password must be at most 50 characters')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Password confirmation is required'),
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

const SignUpContainer = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        passwordConfirmation: '',
      }}
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
            placeholderTextColor={PLACEHOLDER_COLOR}
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
            placeholderTextColor={PLACEHOLDER_COLOR}
            secureTextEntry
            value={values.password}
            onChangeText={handleChange('password')}
          />
          {touched.password && errors.password && (
            <ThemedText style={styles.errorText}>
              {errors.password}
            </ThemedText>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password confirmation"
            placeholderTextColor={PLACEHOLDER_COLOR}
            secureTextEntry
            value={values.passwordConfirmation}
            onChangeText={handleChange('passwordConfirmation')}
          />
          {touched.passwordConfirmation &&
            errors.passwordConfirmation && (
              <ThemedText style={styles.errorText}>
                {errors.passwordConfirmation}
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
              Sign up
            </ThemedText>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};

export default SignUpContainer;
