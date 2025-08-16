// Usage: node scripts/createAdmin.js <email> <password> <name>
// Example: node scripts/createAdmin.js admin@example.com StrongP@ss Admin

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

async function main() {
  const [, , email, password, name] = process.argv;
  if (!email || !password) {
    console.error(
      "Usage: node scripts/createAdmin.js <email> <password> [name]"
    );
    process.exit(2);
  }
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/lankaguide";
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.error("User with that email already exists");
      process.exit(1);
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || "Admin",
      email,
      passwordHash: hash,
      role: "admin",
    });
    console.log("Created admin user:", user.toSafeObject());
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
