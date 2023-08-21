import cors from 'cors';
import bodyParser from "body-parser";
import express, { Application, Request, Response } from 'express';
import helmet from "helmet";
import responses from './utils/responses';
import cookieParser from 'cookie-parser';



const app: Application = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());

require('dotenv').config()
const { PORT } = process.env;

// CONNECTING TO DB
require('./database/database_initialization');

const port = PORT || 5000;
import logger from './logger/logger';

// ROUTES
app.get("/", (req: Request, res: Response) => {
    logger.info('200: Server is Up and Running');
    return res.status(200).send(responses.get_response_object(responses.CODE_SUCCESS, null, "Server is Up And Running"));
});

import UserRoutes from './routes/users';
import AuthRoutes from './routes/auth';
import TweetRoutes from './routes/tweets';

app.use('/api/users', UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/tweets", TweetRoutes);

// SETUP LISTEN FOR APP ON PORT
app.listen(port, () => {
    console.log(`SERVER STARTED:  LISTENTING ON PORT ${port}`)
});
