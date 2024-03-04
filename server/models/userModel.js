const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A user must have first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'A user must have last name'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'A password is needed to create an account'],
  },
  phoneNumber: {
    type: String,
    validate: {
      validator(v) {
        return validator.isMobilePhone(v, 'any', { strictMode: false });
      },
      message: 'Please enter a valid phone number',
    },
    default: 'please enter your phone number',
    trim: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Please enter a valid email address'],
    default: 'please enter your email address',
    trim: true,
    unique: true,
  },
  photo: {
    type: String,
    default: '',
    trim: true,
  },
  address1: {
    type: String,
    default: 'Your address line 1',
    maxlength: [30, 'Please use address2'],
    trim: true,
  },
  address2: {
    type: String,
    default: 'Your address line 2',
    trim: true,
  },
  country: {
    type: String,
    default: 'Your Country',
    trim: true,
  },
  area: {
    type: String,
    default: 'State/Area',
    trim: true,
  },
  zipcode: {
    type: String,
    default: 'Postal Code',
  },
  school: {
    type: String,
    default: 'Please Select Yout School',
  },
  year: {
    type: String,
    default: 'Please Select Your School Year',
  },
  major: {
    type: String,
    default: 'Your major',
    trim: true,
  },
  follows: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  hiddenPosts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
  ],
  isLocked: { type: Boolean, default: false },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
});

userSchema.methods.incrementLoginAttempts = async function incrementLoginAttempts() {
  // If the account is already locked, check if the lockout duration has passed
  if (this.lockUntil && this.lockUntil < Date.now()) {
    await this.updateOne({
      $set: { loginAttempts: 1, isLocked: false },
      $unset: { lockUntil: 1 },
    });
  } else {
    // Otherwise, increment login attempts and possibly lock the account
    const updates = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
      // Lock the account
      updates.$set = {
        lockUntil: Date.now() + 5 * 60 * 1000,
        isLocked: true,
      }; // Lock for 5 min
    }
    await this.updateOne(updates);
  }
};

module.exports = mongoose.model('User', userSchema);
