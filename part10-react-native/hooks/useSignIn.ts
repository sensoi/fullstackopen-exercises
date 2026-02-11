import { gql, useMutation, useApolloClient } from '@apollo/client';
import AuthStorage from '@/utils/authStorage';

const AUTHENTICATE = gql`
  mutation Authenticate($credentials: AuthenticateInput!) {
    authenticate(credentials: $credentials) {
      accessToken
    }
  }
`;

interface AuthenticateData {
  authenticate: {
    accessToken: string;
  };
}

interface AuthenticateVars {
  credentials: {
    username: string;
    password: string;
  };
}

const useSignIn = () => {
  const apolloClient = useApolloClient();
  const authStorage = new AuthStorage();

  const [mutate, result] = useMutation<
    AuthenticateData,
    AuthenticateVars
  >(AUTHENTICATE);

  const signIn = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const { data } = await mutate({
      variables: {
        credentials: {
          username,
          password,
        },
      },
    });

    if (data?.authenticate?.accessToken) {
      await authStorage.setAccessToken(
        data.authenticate.accessToken
      );
      await apolloClient.resetStore();
    }

    return { data };
  };

  return [signIn, result] as const;
};

export default useSignIn;
