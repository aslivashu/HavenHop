const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const{saveRedirectUrl} = require("../middleware.js");
 
const userController = require("../controllers/user.js");


// Route to render the signup page
router.get("/signup", wrapAsync(userController.renderSignup));

// Route to handle user signup
router.post("/signup", saveRedirectUrl, wrapAsync(userController.signup));

// Route to render the login page
router.get("/login", wrapAsync(userController.renderLogin));

// Route to handle user login
router.post("/login",
    saveRedirectUrl, 
    passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
}), 
    wrapAsync(userController.login));

// Route to handle user logout
router.get("/logout", wrapAsync(userController.logout));


module.exports = router;