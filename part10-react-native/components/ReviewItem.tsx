import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
  },
  ratingContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#0366d6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  ratingText: {
    color: '#0366d6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    color: '#586069',
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
  },
});

export const ReviewItem = ({ review }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.username}>{review.user.username}</Text>
        <Text style={styles.date}>
          {new Date(review.createdAt).toLocaleDateString('en-GB')}
        </Text>
        <Text style={styles.text}>{review.text}</Text>
      </View>
    </View>
  );
};
