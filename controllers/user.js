const User = require("../models/user.js");


//render signup page
module.exports.renderSignup = async(req,res)=> {
    res.render("users/signup.ejs");
}

// Signup function
module.exports.signup = async(req,res)=> {
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
             res.redirect(res.locals.redirectUrl || "/listings");
         });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/users/signup");
    }
}

// Render login page
module.exports.renderLogin = async(req,res)=> {
    res.render("users/login.ejs");
}

// Login function
module.exports.login = async(req,res)=> {
        req.flash("success", "Welcome back!");
        res.redirect(res.locals.redirectUrl || "/listings");
}

// Logout function
module.exports.logout = async(req,res, next)=> {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
}