const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtsecret = "satyamtomar";
const fetchuser = require("../middleware/fetchuser");
//Route1 Creating a user using: POST "/api/auth/createuser".Doesn't require Login
router.post(
  "/createuser",
  [
    body("email", "Enter a valid mail").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 1 }),
    body("password", "Password must contain atleast 5 characters").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    //if there are errors, returns bad request
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    //checks whether the email has already been created
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);

      const secpass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email,
      });
      //   .then(user => res.json(user))
      //   .catch(err=>{console.log(err)
      // res.json({error:'Please enter a unique value for email'})
      const data = {
        user: {
          id: user.id,
        },
      };
      success=true;
      const authtoken = jwt.sign(data, jwtsecret);
      res.json({ success,authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route2 authenticate a user.POST "/api/auth/login".No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid mail").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    //if there are errors, returns bad request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ error: "Please try to login with valid credentials" });
      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare)
        return res
          .status(400)
          .json({ error: "Please try to login with valid credentials" });
      
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwtsecret);
      success=true;
      res.json({ success,authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route3 Logined user details. POST "/api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
