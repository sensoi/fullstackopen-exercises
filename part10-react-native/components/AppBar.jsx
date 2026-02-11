import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Link, useRouter } from 'expo-router';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import AuthStorage from '@/utils/authStorage';

const ME = gql`
  query {
    me {
      id
      username
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20,
  },
});

const AppBar = () => {
  const { data } = useQuery(ME);
  const apolloClient = useApolloClient();
  const authStorage = new AuthStorage();
  const router = useRouter();

  const isSignedIn = !!data?.me;

  const signOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.tabs}>
        <Link href="/" asChild>
          <Pressable>
            <Text style={styles.tabText}>Repositories</Text>
          </Pressable>
        </Link>

        {!isSignedIn && (
          <Link href="/signin" replace asChild>
            <Pressable>
              <Text style={styles.tabText}>Sign in</Text>
            </Pressable>
          </Link>
        )}

        {isSignedIn && (
          <Pressable onPress={signOut}>
            <Text style={styles.tabText}>Sign out</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;
