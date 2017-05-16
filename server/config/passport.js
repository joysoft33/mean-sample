'use strict';

import Facebook from 'passport-facebook';
import Local from 'passport-local';
import passport from 'passport';

import User from '../models/user';
import settings from '../utilities/settings';

export default () => {

  let env = settings();

  // Take a look at: http://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
  // and https://howtonode.org/understanding-process-next-tick
  // and https://www.sitepoint.com/local-authentication-using-passport-node-js/
  // and https://www.sitepoint.com/passport-authentication-for-nodejs-applications/

  // Used to serialize the user for the request session
  // We are using id here, but we could use any "unique" information like "email"
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  })

  // Used to deserialize user from the request session:
  passport.deserializeUser(function (id, done) {
    USER.findById(id, function (err, user) {
      done(err, user);
    })
  })

  // Initialize LocalStrategy
  passport.use(new Local.Strategy({
    usernameField: 'email'
  }, (email, password, done) => {
    // Ensure that this will be executed asynchronously
    process.nextTick(function () {
      User.findOne({
        email: email
      })
      .select("+password")
      .exec(function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, {
            message: 'Incorrect email or password.'
          });
        }
        // We are checking if password is the same as the one stored and encrypted in db
        user.validPassword(password, function(err, match) {
          if (err || !match) {
            return done(null, false, {
              message: 'Incorrect email or password.'
            });
          }
          return done(null, user);
        });
      });
    });
  }));

  // Initialize FacebookStrategy
  passport.use(new Facebook({
    clientID: env.facebookAuth.clientID,
    clientSecret: env.facebookAuth.clientSecret,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'name', 'photos', 'emails']
  }, (token, refreshToken, profile, done) => {
    // Ensure that this will be executed asynchronously
    process.nextTick(function () {
      // Retrieve User or create a new one if none was found
      // Use facebook id as unique key to retrieve user
      // Documentation: https://github.com/jaredhanson/passport-facebook
      User.findOne({
        'facebook.id': profile.id
      }, (err, user) => {

        if (err)
          return done(err);

        if (user)
          return done(null, user);
        
        let newUser = new User();

        newUser.email = profile.emails[0].value || '';
        newUser.firstName = profile.name.givenName;
        newUser.lastName = profile.name.familyName;
        newUser.facebook.id = profile.id;
        newUser.facebook.token = token;
        newUser.facebook.photo = profile.photos[0].value || '';

        newUser.save((err) => {
          if (err) throw err;
          return done(null, newUser);
        });
      });
    });

  }));

  return passport;
}