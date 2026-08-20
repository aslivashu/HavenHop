const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const{saveRedirectUrl} = require("../middleware.js");
 
const userController = require("../controllers/user.js");

//route for handle signup and handle signup form submission
router.route("/signup")
    .get(
        wrapAsync(userController.renderSignup))
    .post(
        saveRedirectUrl, 
        wrapAsync(userController.signup));

//route for handle login and handle login form submission
router.route("/login")
        .get(
            wrapAsync(userController.renderLogin))
        .post(
            saveRedirectUrl, 
             passport.authenticate("local", {
             failureRedirect: "/users/login",
             failureFlash: true,
        }), 
        wrapAsync(userController.login));

// Route to handle user logout
router.get("/logout", wrapAsync(userController.logout));


module.exports = router;