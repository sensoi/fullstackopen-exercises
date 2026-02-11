import { useLocalSearchParams } from 'expo-router';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORY } from '../../../graphql/queries';
import RepositoryItem from '../../../components/RepositoryItem';
import { ReviewItem } from '../../../components/ReviewItem';

const FIRST_REVIEWS = 5;

const RepositoryScreen = () => {
  const { id } = useLocalSearchParams();
  const repositoryId = Array.isArray(id) ? id[0] : id;

  const {
    data,
    loading,
    error,
    fetchMore,
    networkStatus,
  } = useQuery(GET_REPOSITORY, {
    variables: {
      id: repositoryId,
      first: FIRST_REVIEWS,
    },
    skip: !repositoryId,
    notifyOnNetworkStatusChange: true,
  });

  if (loading && !data) {
    return <ActivityIndicator />;
  }

  if (error || !data?.repository) {
    return <Text>Error loading repository</Text>;
  }

  const reviews = data.repository.reviews.edges.map(
    (edge: any) => edge.node
  );

  const { hasNextPage, endCursor } =
    data.repository.reviews.pageInfo;

  const isFetchingMore = networkStatus === 3;

  const handleFetchMore = () => {
    if (!hasNextPage || isFetchingMore) {
      return;
    }

    fetchMore({
      variables: {
        after: endCursor,
        first: FIRST_REVIEWS,
      },
    });
  };

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <RepositoryItem
          repository={data.repository}
          showGitHubButton
          disableNavigation
        />
      }
      ItemSeparatorComponent={() => (
        <View style={{ height: 10 }} />
      )}
      onEndReached={handleFetchMore}
      onEndReachedThreshold={0.2}
      ListFooterComponent={
        isFetchingMore ? <ActivityIndicator /> : null
      }
    />
  );
};

export default RepositoryScreen;
