// Import user model
// const { User } = require('../models');
// Import sign token function from auth
// const { signToken } = require('../utils/auth');

import { User } from '../models'; // Adjust path as necessary
import { signToken } from '../utils/auth'; // Adjust path as necessary
import { typeDefs } from './typeDefs.js';

const resolvers = {
  Query: {
    // get a single user by either their id or their username
    async getSingleUser(_, { id, username }, context) {
      const foundUser = await User.findOne({
        $or: [{ _id: id || context.user?._id }, { username: username }],
      });

      if (!foundUser) {
        throw new Error('Cannot find a user with this id or username!');
      }

      return foundUser;
    },
  },
  Mutation: {
    // create a user, sign a token, and return it along with the user
    async createUser(_, { userData }) {
      const user = await User.create(userData);

      if (!user) {
        throw new Error('Something went wrong!');
      }
      const token = signToken(user);
      return { token, user };
    },

    // login a user, sign a token, and return it along with the user
    async login(_, { loginInput }) {
      const { username, email, password } = loginInput;
      const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      const token = signToken(user);
      return { token, user };
    },

    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    async saveBook(_, { bookData }, context) {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error('Error saving the book');
      }
    },

    // remove a book from `savedBooks`
    async deleteBook(_, { bookId }, context) {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("Couldn't find user with this id!");
        }

        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error('Error removing the book');
      }
    },
  },
};

export { resolvers, typeDefs };