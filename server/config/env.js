module.exports = {
  "development": {
    db: process.env.MONGODB_URI ||  'mongodb://localhost:27017/mean-sample-dev',
    jwtSecret: 'cJbdB3t$'
  },
  "production": {
    db: process.env.MONGODB_URI ||  'mongodb://localhost:27017/mean-sample',
    jwtSecret: 'cJbdB3t$'
  }
}