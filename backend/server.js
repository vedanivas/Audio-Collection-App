const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const PORT = process.env.PORT || 5050

// const userRoutes = require('./routes/userRoutes')'
// const adminRoutes = require('./routes/adminRoutes');
dotenv.config()

const server = express()
server.use(express.json())
server.use(bodyParser.json())
server.use(
    bodyParser.urlencoded({
        extended:true,
    })
)

const corsOptions = {
    origin: 'http://localhost:5050/',
    // exposedHeaders: 'authorization'
}
server.use(cors(corsOptions));
server.use(cors())
server.options('*', cors())
  
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 process.env.DB_NAME,
 process.env.DB_USER,
 process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

// server.use('api/users', userRoutes)
// server.use('api/admin', adminRoutes)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

server.get('/', (req, res) => {
    res.send('Hello World')
})