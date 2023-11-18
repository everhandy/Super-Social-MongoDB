const { Thought, User  } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find()
      .populate('thoughts friends', '-__v')
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID!' });
        }
        res.json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID!' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID!' });
        }
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => res.json({ message: 'User and their Thoughts deleted' }))
      .catch((err) => res.status(500).json(err));
  },

  addFriend(req, res) {
    console.log('Request params:', req.params);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.userId} },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user(s) found by the(se) ID(s)!' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user(s) found by the(se) ID(s)!' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;
