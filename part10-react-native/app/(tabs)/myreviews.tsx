import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'expo-router';
import {
  GET_MY_REVIEWS,
  DELETE_REVIEW,
} from '../../graphql/queries';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
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
  header: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    color: '#586069',
    marginBottom: 6,
  },
  text: {
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  item: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});

const ReviewItem = ({
  review,
  onDelete,
}: any) => {
  const router = useRouter();

  const confirmDelete = () => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(review.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.header}>
            {review.repository.fullName}
          </Text>
          <Text style={styles.date}>
            {new Date(review.createdAt).toLocaleDateString('en-GB')}
          </Text>
          <Text style={styles.text}>{review.text}</Text>

          <View style={styles.buttons}>
            <Button
              title="View repository"
              onPress={() =>
                router.push(
                  `/repository/${review.repository.id}`
                )
              }
            />
            <Button
              title="Delete review"
              color="red"
              onPress={confirmDelete}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const MyReviewsScreen = () => {
  const { data, loading, error, refetch } =
    useQuery(GET_MY_REVIEWS);

  const [deleteReview] = useMutation(DELETE_REVIEW, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleDelete = (id: string) => {
    deleteReview({
      variables: { id },
    });
  };

  if (loading) {
    return <Text>Loading…</Text>;
  }

  if (error) {
    return <Text>Error loading reviews</Text>;
  }

  const reviews = data.me.reviews.edges.map(
    (edge: any) => edge.node
  );

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => (
        <ReviewItem
          review={item}
          onDelete={handleDelete}
        />
      )}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => (
        <View style={{ height: 10 }} />
      )}
    />
  );
};

export default MyReviewsScreen;
