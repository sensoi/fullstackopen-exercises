import { View, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ThemedText } from './themed-text';
import useSignIn from '@/hooks/useSignIn';
import { useRouter } from 'expo-router';
import SignInContainer from './SignInContainer';


const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e1e4e8',
    flexGrow: 1,
  },
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

const SignIn = () => {
  const [signIn] = useSignIn();
  const router = useRouter();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await signIn({ username, password });
      router.replace('/');
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
  <ScrollView contentContainerStyle={styles.container}>
    <SignInContainer onSubmit={onSubmit} />

    <Pressable
      style={{ marginTop: 16, alignItems: 'center' }}
      onPress={() => router.push('/signup')}
    >
      <ThemedText style={{ color: '#0366d6' }}>
        Don’t have an account? Sign up
      </ThemedText>
    </Pressable>
  </ScrollView>
);
};

export default SignIn;
