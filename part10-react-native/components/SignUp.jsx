import { ScrollView, StyleSheet } from 'react-native';
import { useMutation, useApolloClient } from '@apollo/client';
import { useRouter } from 'expo-router';

import SignUpContainer from './SignUpContainer';
import { CREATE_USER } from '@/graphql/mutations';
import useSignIn from '@/hooks/useSignIn';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e1e4e8',
    flexGrow: 1,
  },
});

const SignUp = () => {
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();
  const apolloClient = useApolloClient();
  const router = useRouter();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await createUser({
        variables: {
          user: { username, password },
        },
      });

      await signIn({ username, password });
      await apolloClient.resetStore();

      router.replace('/');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SignUpContainer onSubmit={onSubmit} />
    </ScrollView>
  );
};

export default SignUp;
