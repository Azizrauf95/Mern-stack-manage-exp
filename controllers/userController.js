const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

//Register Callback
const registerController = async (req, res) => {

  try {
    const { name, email, password } = req.body;
    //validation
   
    
    //exisiting user
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(401).send({
        success: false,
        message: "user already exisits",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //save new user
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).send({
      success: true,
      message: "New User Created",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error In Register callback",
      success: false,
      error,
    });
  }
};
 /*try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      error,
    });
  }
};*/

module.exports = { loginController, registerController };