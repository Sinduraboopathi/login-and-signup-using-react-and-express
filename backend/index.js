import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('test_schema', 'root', process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
});



const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true,
  freezeTableName: true,  // Prevents Sequelize from pluralizing table names
});

// Sync Database
sequelize.sync();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error during signup.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ username: user.username, token });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
});

// Protected Route Example
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}, this is your profile!` });
});

// Start Server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
