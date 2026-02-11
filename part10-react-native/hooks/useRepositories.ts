import { gql, useQuery } from '@apollo/client';

const GET_REPOSITORIES = gql`
  query GetRepositories(
    $orderBy: AllRepositoriesOrderBy
    $orderDirection: OrderDirection
    $searchKeyword: String
  ) {
    repositories(
      orderBy: $orderBy
      orderDirection: $orderDirection
      searchKeyword: $searchKeyword
    ) {
      edges {
        node {
          id
          fullName
          description
          language
          forksCount
          stargazersCount
          ratingAverage
          reviewCount
          ownerAvatarUrl
        }
      }
    }
  }
`;

const getOrderVariables = (sort: string) => {
  switch (sort) {
    case 'HIGHEST':
      return {
        orderBy: 'RATING_AVERAGE',
        orderDirection: 'DESC',
      };
    case 'LOWEST':
      return {
        orderBy: 'RATING_AVERAGE',
        orderDirection: 'ASC',
      };
    default:
      return {
        orderBy: 'CREATED_AT',
        orderDirection: 'DESC',
      };
  }
};

const useRepositories = (
  sort: string = 'LATEST',
  searchKeyword: string = ''
) => {
  const orderVariables = getOrderVariables(sort);

  const { data, loading, error } = useQuery(GET_REPOSITORIES, {
    variables: {
      ...orderVariables,
      searchKeyword,
    },
    fetchPolicy: 'cache-and-network',
  });

  const repositories = data
    ? data.repositories.edges.map((edge: any) => edge.node)
    : [];

  return { repositories, loading, error };
};

export default useRepositories;
