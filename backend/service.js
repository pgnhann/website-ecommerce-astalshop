const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user.email); // or user.id if you prefer using ID
});

passport.deserializeUser(async (email, done) => {
    try {
        const result = await client.query("SELECT * FROM login WHERE email = $1", [email]);
        if (result.rows.length > 0) {
            done(null, result.rows[0]);
        } else {
            done(new Error('User not found'));
        }
    } catch (error) {
        done(error);
    }
});

module.exports = (client) => {
    const router = express.Router();

    async function findOrCreateUser (profile, provider) {
        const email = profile.emails[0].value;
        const name = profile.displayName; 
        const result = await client.query("SELECT * FROM login WHERE email = $1", [email]);
    
        if (result.rows.length > 0) {
            console.log("User  already exists:", result.rows[0].email);
            return result.rows[0]; 
        } else {
            // Insert vào bảng login
            await client.query(
                "INSERT INTO login (email, provider) VALUES ($1, $2)",
                [email, provider]  // Dùng provider được truyền vào
            );
    
            // Insert vào bảng users
            await client.query(
                "INSERT INTO users (email, fullname) VALUES ($1, $2)",
                [email, name]
            );
            return { email, name };
        }
    }    

    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: '1075187759995-4iatnbfn8ubm7ots3brt1teuh70r287p.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:5000/services/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findOrCreateUser (profile, 'Google'); // Thêm provider
            console.log("User found/created:", user);
            return done(null, user);
        } catch (error) {
            console.error("Error in GoogleStrategy:", error);
            return done(error);
        }
    }));

    // Facebook Strategy
    passport.use(new FacebookStrategy({
        clientID: '2034179840373936', 
        clientSecret: '92c97db774f6302555998f423ec66c6e', 
        callbackURL: 'http://localhost:5000/services/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails'] 
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findOrCreateUser (profile, 'Facebook'); // Thêm provider
            console.log("User found/created:", user);
            return done(null, user);
        } catch (error) {
            console.error("Error in FacebookStrategy:", error);
            return done(error);
        }
    }));


    router.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account' 
    }));    

    router.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: 'http://localhost:3000/signin' }),
        async (req, res) => {
            try {
                const email = req.user.email;
                const userResult = await client.query("SELECT fullname FROM users WHERE email = $1", [email]);
                const fullname = userResult.rows[0]?.fullname || "User";
    
                let action = "register"; 
                if (req.user) {
                    action = "login"; 
                }
                res.redirect(`http://localhost:3000/?status=success&action=${action}&fullname=${encodeURIComponent(fullname)}`);
            } catch (error) {
                console.error("Error in Google callback:", error);
                res.redirect('http://localhost:3000/?status=failure');
            }
        }
    );    

    router.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'] 
    }));

    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/signin' }),
        async (req, res) => {
            try {
                const email = req.user.email;
                const userResult = await client.query("SELECT fullname FROM users WHERE email = $1", [email]);
                const fullname = userResult.rows[0]?.fullname || "User";
    
                let action = "register"; 
                if (req.user) {
                    action = "login"; 
                }
                res.redirect(`http://localhost:3000/?status=success&action=${action}&fullname=${encodeURIComponent(fullname)}`);
            } catch (error) {
                console.error("Error in Facebook callback:", error);
                res.redirect('http://localhost:3000/?status=failure');
            }
        }
    );    

    return router;
};