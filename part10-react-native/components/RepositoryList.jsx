import { ActivityIndicator, Text } from 'react-native';
import { useState, useEffect } from 'react';
import useRepositories from '../hooks/useRepositories';
import RepositoryListContainer from './RepositoryListContainer';

const RepositoryList = () => {
  const [sort, setSort] = useState('LATEST');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] =
    useState('');

  // Manual debounce (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword]);

  const { repositories, loading, error } = useRepositories(
    sort,
    debouncedSearchKeyword
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error loading repositories</Text>;
  }

  return (
    <RepositoryListContainer
      repositories={repositories}
      sort={sort}
      setSort={setSort}
      searchKeyword={searchKeyword}
      setSearchKeyword={setSearchKeyword}
    />
  );
};

export default RepositoryList;
