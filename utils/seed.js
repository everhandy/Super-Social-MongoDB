const mongoose = require('mongoose');
const { Thought, User } = require('../models');

// Function to seed users and their thoughts
async function seedUsers() {
  try {
    const userData = [
      { username: 'user1', email: 'user1@example.com' },
      { username: 'user2', email: 'user2@example.com' },
      { username: 'user3', email: 'user3@example.com' },
    ];

    const users = await User.create(userData);
    console.log(`${users.length} user(s) created.`);

    for (const user of users) {
      const thoughtCount = 10;
      const thoughts = [];

      for (let i = 0; i < thoughtCount; i++) {
        const thoughtText = `Thought ${i + 1} for ${user.username}`;
        const username = user.username;
        const thought = new Thought({
          thoughtText,
          username,
          // Associate thoughts with users
          userId: user._id,
        });

        thoughts.push(thought);
      }

      await Thought.create(thoughts);
      console.log(`${thoughts.length} thoughts created for ${user.username}`);

      user.thoughts = thoughts.map((thought) => thought._id);
      await user.save();
    }
  } catch (err) {
    console.error('Error seeding.', err);
  }
}

// Connect to the database, seed data, and disconnect
async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Super-Social-MongoDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB.');

    await User.createIndexes(); // Ensure indexes are created

    await seedUsers(); // Seed users and thoughts
  } catch (err) {
    console.error('Error connecting/seeding', err);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

// Initialize the seeding process
seed();
