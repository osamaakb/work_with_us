
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')
const userModel = require('../Models/users-model')


var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const { rows, ...response } = await userModel.findUserByEmail(jwt_payload.email)

        console.log(rows[0])
        
        if (rows) {
            return done(null, rows[0])
        }
        else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


module.exports = passport

module.exports.auth = (req, res, next) => passport.authenticate('jwt', (err, user) => {
    if (err) {
        next(err)
    } else if (!user) {
        next(new Error('User not found'))
    } else {
        req.user = user
        next()
    }
})(req, res, next)