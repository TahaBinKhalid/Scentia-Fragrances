const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create and save user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully in scentia_db!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.registerUser = async (req, res) => {
  console.log("Register attempt received:", req.body); // Check if data is arriving
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    console.log("Success! Saved to collection:", savedUser.collection.name);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("SAVE ERROR:", error.message); // This will tell you why the folder isn't appearing
    res.status(500).json({ error: error.message });
  }
};