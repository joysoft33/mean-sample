module.exports = {
  "development": {
    db: process.env.MONGODB_URI ||  'mongodb://localhost:27017/mean-sample-dev'
  },
  "production": {
    db: process.env.MONGODB_URI ||  'mongodb://localhost:27017/mean-sample'
  }
}