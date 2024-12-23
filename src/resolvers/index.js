
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  Query: {
    getUsers: async (parent, args, { models, user }) => {
      // Authentication logic here (if needed)
      if (!user) {
        throw new Error('Authentication required');
      }
      
      const requestingUser = await models.User.findById(user.userId);
      if (!requestingUser || !requestingUser.admin) {
        throw new Error('Only admins can fetch all users');
      }

      return await models.User.find({}, '-password'); // Exclude password field
    },

    getTasks: async (parent, args, { models, user }) => {
      // Optional: Authentication check
      if (!user) {
        throw new Error('Authentication required');
      }

      return await models.Task.find(); // Fetch all tasks
    },
  },

  Mutation: {
    addTask: async (parent, { title, description, status }, { models }) => {
      const task = new models.Task({ title, description, status });
      return await task.save();
    },

    updateTaskStatus: async (parent, { id, status }, { models }) => {
      const task = await models.Task.findById(id);
      if (!task) {
        throw new Error(`Task with id ${id} not found`);
      }
      task.status = status;
      return await task.save();
    },  
    
    deleteTask: async (parent, { id }, { models }) => {
      const task = await models.Task.findByIdAndDelete(id);
      if (!task) {
        throw new Error(`Task with id ${id} not found`);
      }
      return task;
    },

    deleteUser: async (parent, { id }, { models, user }) => {
      // Ensure the requesting user is authenticated
      if (!user) {
        throw new Error('Authentication required');
      }
  
      // Check if the requesting user is an admin
      const requestingUser = await models.User.findById(user.userId);
      if (!requestingUser || !requestingUser.admin) {
        throw new Error('Only an admin can delete users');
      }
  
      // Proceed to delete the specified user
      const userToDelete = await models.User.findByIdAndDelete(id);
      if (!userToDelete) {
        throw new Error(`User with id ${id} not found`);
      }
  
      return userToDelete;
    },

    SignUp: async (parent, { name, email, password }, { models }) => {
      const existingUser = await models.User.findOne({ email });
      if (existingUser) {
        throw new Error('Email is already in use');
      }
  
      // Check if there are any users in the database
      const userCount = await models.User.countDocuments();
  
      // The first user will be an admin, subsequent users will be normal users
      const isAdmin = userCount === 0; // The first user is admin
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new models.User({
        name,
        email,
        password: hashedPassword,
        admin: isAdmin, // Assign admin status to the first user
      });
  
      return await user.save();
    },
  
    LogIn: async (parent, { email, password }, { models }) => {
      const user = await models.User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return token;
    },
  },
};
