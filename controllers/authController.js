const User = require("../models/User");
const UserData = require("../models/UserData");
const { StatusCodes } = require("http-status-codes");
const { OAuth2Client } = require("google-auth-library");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

//initilaises a user model and a userdata model

const CLIENT_ID = process.env.GOOGLE_API_TOKEN;

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exits");
  }

  //first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  await UserData.create({ user: user._id, Username: user.name });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const googleLogin = async (req, res) => {
  const password = "secret";

  const { id_token } = req.body;

  const client = new OAuth2Client(CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    const emailAlreadyExists = await User.findOne({ email });

    if (!emailAlreadyExists) {
      const role = "user";
      const user = await User.create({ name, email, password, role });
      await UserData.create({ user: user._id, Username: user.name });

      const tokenUser = createTokenUser(user);
      attachCookiesToResponse({ res, user: tokenUser });

      res.status(StatusCodes.CREATED).json({ user: tokenUser });
    } else if (emailAlreadyExists) {
      const tokenUser = createTokenUser(emailAlreadyExists);
      attachCookiesToResponse({ res, user: tokenUser });
      res.status(StatusCodes.OK).json({ user: tokenUser });
    }
  } catch (error) {
    console.error(error);
    throw new CustomError.BadRequestError("Google login failed");
  }
};

// 'token' was previosuly chosen as the name for the cookie sent to browser
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "None",
    secure: true,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

module.exports = {
  register,
  login,
  logout,
  googleLogin,
};
