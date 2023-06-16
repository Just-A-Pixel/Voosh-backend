const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
  google: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  email: {
      type: String,
      required: true
  },
  hasPassword: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: ''
  },
  items: [],

});

// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checks if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);