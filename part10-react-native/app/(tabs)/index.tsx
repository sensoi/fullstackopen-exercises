import { StyleSheet, View } from 'react-native';
import AppBar from '@/components/AppBar';
import RepositoryList from '@/components/RepositoryList';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <AppBar />
      <RepositoryList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

