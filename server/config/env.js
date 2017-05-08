module.exports = {
  "development": {
    db: process.env.MONGODB_URI ||  'mongodb://localhost:27017/mean-sample-dev',
    cookieToken: "mean-token-dev",
    jwtSecret: 'cJbdB3t$',
    facebookAuth: {
      clientID: '000000',
      clientSecret: '00000',
      callbackURL: 'cb'
    }
  },
  "production": {
    db: process.env.MONGODB_URI ||  'mongodb://localhost:27017/mean-sample',
    cookieToken: "mean-token",
    jwtSecret: 'cJbdB3t$',
    facebookAuth: {
      clientID: '000000',
      clientSecret: '00000',
      callbackURL: 'cb'
    }
  }
}