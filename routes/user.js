const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

// Route to render the signup page
router.get("/signup", wrapAsync(async(req,res)=> {
    res.render("users/signup.ejs");
}));

// Route to handle user signup
router.post("/signup", wrapAsync(async(req,res)=> {
    try{
        let {email, username, password} = req.body;   
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log("Registered user: " + registeredUser);
           req.login(registeredUser, (err)=> {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to HavenHop!");
            res.redirect("/listings");  
         });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/users/signup");
    }
}));

// Route to render the login page
router.get("/login", wrapAsync(async(req,res)=> {
    res.render("users/login.ejs");
}));

// Route to handle user login
router.post("/login",
    passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
}), 
    wrapAsync(async(req,res)=> {
        req.flash("success", "Welcome back!");
        res.redirect("/listings");
}));

// Route to handle user logout
router.get("/logout", wrapAsync(async(req,res, next)=> {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
}));

module.exports = router;