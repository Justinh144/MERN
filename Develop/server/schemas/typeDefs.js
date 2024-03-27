// const { gql } = require('apollo-server-express');
import {gql} from '@apollo/server'; 


const typeDefs = gql`
  # Define a User type with fields that match your User model
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  # Define a Book type
  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # Define the Auth type to handle tokens
  type Auth {
    token: ID!
    user: User
  }

  # Queries
  type Query {
    # Define a query to get a single user by ID or username
    getSingleUser(id: ID, username: String): User
  }

  # Mutations
  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

  # Book mutations
  saveBook(bookId: String!): User
  deleteBook(bookId: ID!): User
  deleteBook(bookId: ID!): Book
  
    Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            email
  }
`;

module.exports = typeDefs;