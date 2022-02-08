export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || 'd7e32398ee40573a075741546c5c9a1b'
}
