import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { prisma } from '../Config/index.js';
dotenv.config();

const createToken = (username, email, id) => {
  return jwt.sign({ username, email, id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    const token = createToken(username, email, newUser.id);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true 
    });

    res.status(201).json({ message: 'User created successfully', data: { user_id: newUser.id, username: newUser.username, email: newUser.email } });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const userLogin = async (req, res) => {
  const {email, password} = req.body;
  console.log(`${email} and ${password} are received`);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(user, " user fetched from DB");

    const isPsswdVal = await bcrypt.compare(password, user.password);
    if (!isPsswdVal) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log("Password is valid");

    const token = createToken(user.username, email, user.id);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true 
    });
    console.log("Token created and cookie set");
    res.status(200).json({ message: 'Login successful', data: {user_id: user.id, username: user.username, email: user.email} });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const userDetails = async (req, res) => {
  const { email, username, id } = req.user;
  if(email && username){
    res.status(200).json({ 
      user_id: id, email, username
    });
  } else {
    res.status(400).json({ message: 'User Not logged In' });
  }
}

export const userLogout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
}
