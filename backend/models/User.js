const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

// helper to omit sensitive fields on toJSON
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
