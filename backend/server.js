import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

import adminRoute from './routes/admin.route.js';
import userRoute from './routes/user.route.js';
const port = process.env.PORT || 5050;


const server = express();
server.use(express.json());
server.use(bodyParser.json());
server.use(
    bodyParser.urlencoded({
        extended:true,
    })
);

const corsOptions = {
    origin: 'http://localhost:5050/',
    exposedHeaders: 'authorization'
}
server.use(cors(corsOptions));
server.use(cors());
server.options('*', cors());
  
// Admin routes
server.use('/api/admin', adminRoute);

// User routes
server.use('/api/users', userRoute);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

server.get('/', (req, res) => {
    res.send('Hello World');
})

export default server;