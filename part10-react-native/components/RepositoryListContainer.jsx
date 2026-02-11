import {
  FlatList,
  View,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
} from 'react-native';
import RepositoryItem from './RepositoryItem';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#f6f8fa',
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  sortOption: {
    paddingVertical: 8,
  },
  activeSort: {
    fontWeight: 'bold',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryListHeader = ({
  sort,
  setSort,
  searchKeyword,
  setSearchKeyword,
}) => {
  return (
    <View style={styles.header}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search repositories"
        placeholderTextColor="#6e7781"
        value={searchKeyword}
        onChangeText={setSearchKeyword}
      />

      <Pressable
        style={styles.sortOption}
        onPress={() => setSort('LATEST')}
      >
        <Text style={sort === 'LATEST' && styles.activeSort}>
          Latest repositories
        </Text>
      </Pressable>

      <Pressable
        style={styles.sortOption}
        onPress={() => setSort('HIGHEST')}
      >
        <Text style={sort === 'HIGHEST' && styles.activeSort}>
          Highest rated repositories
        </Text>
      </Pressable>

      <Pressable
        style={styles.sortOption}
        onPress={() => setSort('LOWEST')}
      >
        <Text style={sort === 'LOWEST' && styles.activeSort}>
          Lowest rated repositories
        </Text>
      </Pressable>
    </View>
  );
};

const RepositoryListContainer = ({
  repositories,
  sort,
  setSort,
  searchKeyword,
  setSearchKeyword,
}) => {
  return (
    <FlatList
      data={repositories}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <RepositoryItem repository={item} />
      )}
      ListHeaderComponent={
        <RepositoryListHeader
          sort={sort}
          setSort={setSort}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
      }
    />
  );
};

export default RepositoryListContainer;
