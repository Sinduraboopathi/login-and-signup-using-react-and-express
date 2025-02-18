import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

// Initialize Sequelize
const sequelize = new Sequelize('test_schema', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define User Model
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  }, {
    timestamps: false, // Disable createdAt and updatedAt
  });
  

// Sync Database
sequelize.sync();

// Express App
const app = express();
app.use(cors());
app.use(express.json());

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error during signup.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    res.status(200).json({ username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
});

// Start Server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});