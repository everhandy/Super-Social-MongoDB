const { Schema, model } = require('mongoose');
const moment = require('moment');

// Function to format the createdAt field using moment.js
function dateFormat(createdAtVal) {
  return moment(createdAtVal).format('YYYY-MM-DD HH:mm');
}

// Reaction Schema
const reactionSchema = require('./reaction');

// Thought Schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // formating date using moment
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username: {
      type: String,
      required: true,
    },
    // using reaction.js here
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Virtual retrieves the length of the thought's reactions array
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Model creation based on the thoughtSchema
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;