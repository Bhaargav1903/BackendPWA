const { gql } = require('apollo-server-express');

module.exports = gql`
  type User { 
    id: ID! 
    name: String! 
    email: String! 
    password: String! 
    admin: Boolean! 
  }

  type Task { 
    id: ID! 
    title: String! 
    description: String
    status: String! 
  }

  type Query { 
    getUsers: [User!] 
    getTasks: [Task!]
  }

  type Mutation {  
    addTask(title: String!, description: String, status: String!): Task 
    updateTaskStatus(id: ID!, status: String!): Task 
    deleteTask(id: ID!): Task
    deleteUser(id: ID!): User
    SignUp(name: String!, email: String!, password: String!): User  
    LogIn(email: String!, password: String!): String
  }
`;
