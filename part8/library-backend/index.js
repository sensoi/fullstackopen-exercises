const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET = 'VERY_SECRET_KEY'

/* DATA */

const authors = [
  { name: 'Robert Martin', born: 1952, id: '1' },
  { name: 'Martin Fowler', born: 1963, id: '2' },
]

const books = []

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
    author: Author!
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
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

/* RESOLVERS */

const resolvers = {
  Query: {
    allBooks: () => books,
    allAuthors: () => authors,
    me: (root, args, context) => context.currentUser,
  },

  Book: {
    author: (root) =>
      authors.find(a => a.name === root.author),
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

      // ✅ THIS IS THE EXACT LINE YOU WERE ASKING ABOUT
      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },

    login: (root, args) => {
      const user = users.find(u => u.username === args.username)
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      return {
        value: jwt.sign(
          { username: user.username, id: user.id },
          JWT_SECRET
        ),
      }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

/* SERVER */

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      const decoded = jwt.verify(auth.substring(7), JWT_SECRET)
      return {
        currentUser: users.find(u => u.id === decoded.id),
      }
    }
    return {}
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
