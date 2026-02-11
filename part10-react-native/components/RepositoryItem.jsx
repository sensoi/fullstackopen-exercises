import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  topRow: {
    flexDirection: 'row',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  fullName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: '#586069',
    marginBottom: 6,
  },
  language: {
    alignSelf: 'flex-start',
    backgroundColor: '#0366d6',
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#586069',
  },
  githubButton: {
    marginTop: 16,
    backgroundColor: '#0366d6',
    padding: 14,
    borderRadius: 6,
  },
  githubButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const formatCount = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return String(value);
};

const RepositoryItem = ({
  repository,
  showGitHubButton = false,
  disableNavigation = false,
}) => {
  const router = useRouter();

  const content = (
    <View style={styles.container} testID="repositoryItem">
      <View style={styles.topRow}>
        <Image
          style={styles.avatar}
          source={{ uri: repository.ownerAvatarUrl }}
        />

        <View style={styles.info}>
          <Text style={styles.fullName}>{repository.fullName}</Text>
          <Text style={styles.description}>{repository.description}</Text>
          <Text style={styles.language}>{repository.language}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatCount(repository.stargazersCount)}
          </Text>
          <Text style={styles.statLabel}>Stars</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatCount(repository.forksCount)}
          </Text>
          <Text style={styles.statLabel}>Forks</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{repository.reviewCount}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{repository.ratingAverage}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {showGitHubButton && (
        <Pressable
          style={styles.githubButton}
          onPress={() => Linking.openURL(repository.url)}
        >
          <Text style={styles.githubButtonText}>Open in GitHub</Text>
        </Pressable>
      )}
    </View>
  );

  if (disableNavigation) {
    return content;
  }

  return (
    <Pressable onPress={() => router.push(`/repository/${repository.id}`)}>
      {content}
    </Pressable>
  );
};

export default RepositoryItem;
