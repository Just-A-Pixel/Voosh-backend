import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  google: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
});
const User = mongoose.model("User", UserSchema);

export default User;