const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppDataSource = require("../config/data-source");

const User = AppDataSource.getRepository("User");

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "2h"
    }
  );
}

function safeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      where: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({message: "Username or email already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = User.create({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await User.save(newUser);

    const token = createToken(savedUser);

    return res.status(201).json({
      message: "User registered successfully",
      user: safeUser(savedUser),
      token
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      return res.status(401).json({message: "Invalid email or password"});
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful",
      user: safeUser(user),
      token
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {register,login};