import express from "express";
import { graphqlHTTP as expressGraphQL } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
// import GraphQLSchema
const app = express();

const books = [
  {
    id: 1,
    name: "Harry Potter and the Chamber of Secrets",
    authorId: 1,
  },
  {
    id: 2,
    name: "Jurassic Park",
    authorId: 2,
  },
  {
    id: 3,
    name: "The Lord of the Rings",
    authorId: 3,
  },
];

const authors = [
  {
    id: 1,
    name: "J.K. Rowling",
  },
  {
    id: 2,
    name: "Michael Crichton",
  },
  {
    id: 3,
    name: "J.R.R. Tolkien",
  },
];

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author of a book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A Single Book",
      args: {
        id: { type: GraphQLInt },
      },

      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },

    books: {
      type: new GraphQLList(BookType),
      description: "A Single Book",

      resolve: (parent, args) => books,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },

      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };

        books.push(book);
        return book;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
