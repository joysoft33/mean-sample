'use strict';

import Facebook from 'passport-facebook';
import Local from 'passport-local';
import passport from 'passport';

import User from '../models/user';
import settings from '../utilities/settings';

/**
 * The Passport authentication module initialization
 */
export default function () {

  let env = settings();

  /**
   * Initialize Passport LocalStrategy
   */
  passport.use(new Local.Strategy({

    usernameField: 'email',
    passwordField: 'password'

  }, (email, password, done) => {
    // Ensure that this will be executed asynchronously
    process.nextTick(() => {

      User.findOne({
          email: email
        })
        .select('+password')
        .exec((err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'Incorrect email or password.'
            });
          }
          // We are checking if password is the same as the one stored and encrypted in db
          user.validPassword(password, (err, match) => {
            if (err || !match) {
              return done(err || 'Incorrect user email or password', false);
            }
            return done(null, user);
          });
        });
    });
  }));

  /**
   * Initialize the Passport FacebookStrategy
   */
  passport.use(new Facebook({

    clientID: env.facebookAuth.clientID || '0',
    clientSecret: env.facebookAuth.clientSecret || '0',
    callbackURL: env.facebookAuth.callbackURL,
    profileFields: ['id', 'name', 'photos', 'emails']

  }, (token, refreshToken, profile, done) => {
    // Ensure that this will be executed asynchronously
    process.nextTick(() => {

      User.findOne({
        email: profile.emails[0].value
      }, (err, user) => {

        if (err) {
          // db error ?
          return done(err);
        }

        if (!user) {
          // No user found matching the given email address
          // Create a new user
          user = new User();
          user.email = profile.emails[0].value || '';
          user.firstName = profile.name.givenName;
          user.lastName = profile.name.familyName;
        } else if (user.facebook.id) {
          // User found and Facebook credentials already saved
          return done(null, user);
        }

        // Save Facebook credentials and avatar url
        user.facebook.token = token;
        user.facebook.id = profile.id;
        user.facebook.photo = profile.photos[0].value || '';

        // Create or update the user
        User.findByIdAndUpdate(user._id, user, {
          new: true,
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