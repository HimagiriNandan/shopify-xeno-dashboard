import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { prisma } from '../Config/index.js';
dotenv.config();

const createToken = (username, email) => {
  return jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export const userSignup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userfound = await prisma.user.findUnique({ where: { email } });
    if (userfound) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashPsswd = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username, email, password: hashPsswd },
    });
    const token = createToken(username, email);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true 
    });

    res.status(201).json({ message: 'User created successfully', data: { username: newUser.username, email: newUser.email } });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const userLogin = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPsswdVal = await bcrypt.compare(password, user.password);
    if (!isPsswdVal) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user.username, email);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true 
    });
    res.status(200).json({ message: 'Login successful', data: {username: user.username, email: user.email} });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const userDetails = async (req, res) => {
  const { email, username } = req.user;
  if(email && username){
    res.status(200).json({ 
      email, username
    });
  } else {
    res.status(400).json({ message: 'User Not logged In' });
  }
}

export const userLogout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
}
