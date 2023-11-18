const { Schema, Types } = require('mongoose');
const moment = require('moment');

// Function to format the createdAt field using moment.js
function dateFormat(createdAtVal) {
  return moment(createdAtVal).format('YYYY-MM-DD HH:mm');
}

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 100,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      // takes time and formats it
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    // not ID
    id: false,
  }
);

// export reactionSchema
module.exports = reactionSchema;
