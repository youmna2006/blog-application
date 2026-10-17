const AppDataSource = require("../config/data-source");

const User = AppDataSource.getRepository("User");

function safeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findOne({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user: safeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findOne({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const { username, email } = req.body;

    if (username !== undefined && username !== user.username) {
      const existingUsername = await User.findOne({
        where: { username }
      });

      if (existingUsername) {
        return res.status(409).json({
          message: "Username already exists"
        });
      }

      user.username = username;
    }

    if (email !== undefined && email !== user.email) {
      const existingEmail = await User.findOne({
        where: { email }
      });

      if (existingEmail) {
        return res.status(409).json({
          message: "Email already exists"
        });
      }

      user.email = email;
    }

    const updatedUser = await User.save(user);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: safeUser(updatedUser)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile
};