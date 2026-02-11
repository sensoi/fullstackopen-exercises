import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities';
import Constants from 'expo-constants';
import AuthStorage from '@/utils/authStorage';

const authStorage = new AuthStorage();

const httpLink = new HttpLink({
  uri: Constants.expoConfig?.extra?.apolloUri,
});

const authLink = setContext(async (_, { headers }) => {
  const accessToken = await authStorage.getAccessToken();

  return {
    headers: {
      ...headers,
      authorization: accessToken
        ? `Bearer ${accessToken}`
        : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          repositories: relayStylePagination(),
        },
      },
      Repository: {
        fields: {
          reviews: relayStylePagination(),
        },
      },
    },
  }),
});

export default client;
