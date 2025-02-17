const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2000
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],

  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
})


const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;