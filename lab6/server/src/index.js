import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import router from './routes/index.js';
import {ErrorMiddleware} from './middlewares/errorMiddleware.js';   
import cors from 'cors';

const app = express();  
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: 'GET,POST,PUT,DELETE',
}));
// DATABASE_URL="postgres://avnadmin:AVNS_ahLCO_Wuho4bDmmxnYM@pg-15940cc0-denisgutzan-60e9.e.aivencloud.com:18384/defaultdb?sslmode=require"
app.use('/api', router);    

app.use(ErrorMiddleware);

app.listen(4001, () => {
    console.log('Server is running on port 4001');
})