const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'VERY_SECRET_KEY'

/* DATA */

const authors = [
  { name: 'Robert Martin', born: 1952, id: '1' },
  { name: 'Martin Fowler', born: 1963, id: '2' },
  { name: 'Fyodor Dostoevsky', born: 1821, id: '3' },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring'],
    id: '1',
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design'],
    id: '2',
  },
  {
    title: 'Refactoring',
    published: 1999,
    author: 'Martin Fowler',
    genres: ['refactoring'],
    id: '3',
  },
  {
    title: 'Crime and Punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime'],
    id: '4',
  },
]

const users = [
  {
    username: 'admin',
    favoriteGenre: 'refactoring',
    id: '1',
  },
]

/* SCHEMA */

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allUsers: [User!]!
    bookCount: Int!
    authorCount: Int!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      born: Int!
    ): Author

    login(
      username: String!
      password: String!
    ): Token
  }
`

/* RESOLVERS */

const resolvers = {
  Query: {
    allBooks: (root, args) => {
      let result = books

      if (args.author) {
        result = result.filter(b => b.author === args.author)
      }

      if (args.genre) {
        result = result.filter(b => b.genres.includes(args.genre))
      }

      return result
    },
    allAuthors: () => authors,
    allUsers: () => users,
    bookCount: () => books.length,
    authorCount: () => authors.length,
    me: (root, args, context) => {
      return context.currentUser
    },
  },

  Author: {
    bookCount: (root) =>
      books.filter(b => b.author === root.name).length,
  },

  Mutation: {
    addBook: (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      let author = authors.find(a => a.name === args.author)

      if (!author) {
        author = {
          name: args.author,
          id: String(authors.length + 1),
        }
        authors.push(author)
      }

      const book = {
        ...args,
        id: String(books.length + 1),
      }

      books.push(book)
      return book
    },

    editAuthor: (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      const author = authors.find(a => a.name === args.name)
      if (!author) return null

      author.born = args.born
      return author
    },

    login: (root, args) => {
      const user = users.find(u => u.username === args.username)

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const userForToken = {
        username: user.username,
        id: user.id,
      }

      return {
        value: jwt.sign(userForToken, JWT_SECRET),
      }
    },
  },
}

/* SERVER */

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req.headers.authorization

    if (auth && auth.startsWith('Bearer ')) {
      try {
        const decodedToken = jwt.verify(
          auth.substring(7),
          JWT_SECRET
        )

        const currentUser = users.find(
          u => u.id === decodedToken.id
        )

        return { currentUser }
      } catch {
        return {}
      }
    }

    return {}
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
