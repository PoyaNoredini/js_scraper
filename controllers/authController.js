const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

const singToken = id => {
    return jwt.sign({id} , process.env.JWT_SECRET,{        expiresIn : process.env.JWT_EXPIRES_IN
    });
}

// Token generator
const createSendToken = (user, statusCode, res) => {
  const token = singToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
if (user.passwordConfirm) {
    user.passwordConfirm = undefined;
  }
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
// Register controller
exports.register = catchAsync(async (req, res) => {
 
 try {
  const newUser = await User.create({
    user_name: req.body.user_name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
});
  createSendToken(newUser , 201 , res);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

// Login controller
exports.login = catchAsync(async (req, res) => {
  try {
    const { user_name, password } = req.body;

    const user = await User.findOne({ where: { user_name } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    createSendToken(user , 200 , res); 
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})


