const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

/* DATA */

const authors = [
  {
    name: 'Robert Martin',
    id: '1',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: '2',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: '3',
    born: 1821,
  },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: '1',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: '2',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring',
    published: 1999,
    author: 'Martin Fowler',
    id: '3',
    genres: ['refactoring'],
  },
  {
    title: 'Crime and Punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: '4',
    genres: ['classic', 'crime'],
  },
]

/* SCHEMA */

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
  }

  type Query {
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    bookCount: Int!
    authorCount: Int!
  }

  type Mutation {
  addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
  ): Book
}

`

/* RESOLVERS */

const resolvers = {
    Mutation: {
  addBook: (root, args) => {
    const book = {
      title: args.title,
      author: args.author,
      published: args.published,
      genres: args.genres,
      id: String(books.length + 1),
    }

    books.push(book)
    return book
  },
},
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
    bookCount: () => books.length,
    authorCount: () => authors.length,
  },
}

/* SERVER */

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
