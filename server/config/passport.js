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
        .select('+password')
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
          user.validPassword(password, function (err, match) {
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
    callbackURL: env.facebookAuth.callbackURL,
    profileFields: ['id', 'name', 'photos', 'emails']
  }, (token, refreshToken, profile, done) => {
    // Ensure that this will be executed asynchronously
    process.nextTick(function () {

      User.findOne({
        'email': profile.emails[0].value
      }, (err, user) => {

        if (err) {
          return done(err);
        }

        if (!user) {
          user = new User();
          user.email = profile.emails[0].value || '';
          user.firstName = profile.name.givenName;
          user.lastName = profile.name.familyName;
        } else if (user.facebook.id) {
          return done(null, user);
        }

        user.facebook.token = token;
        user.facebook.id = profile.id;
        user.facebook.photo = profile.photos[0].value || '';

        User.update({
          _id: user._id
        }, user, {
          upsert: true,
          setDefaultsOnInsert: true
        }, (err, newUser) => {
          if (err) {
            return done(err);
          } else {
            return done(null, newUser);
          }
        });
      });
    });

  }));

  return passport;
}