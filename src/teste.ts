import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { router } from './routes/router';
import { routerUser } from './routes/user';
import { routerAdmin } from './routes/admin';
import { instalationRouter } from './routes/installation';
import { routerSystem } from './routes/system';
import errorHandling from './middlewares/errorHandling';
import acceptedMethod from './security/acceptedMethods';
import DatabaseManager from './services/databaseManagerService';

const teste = express();

DatabaseManager.checkStatusSystem();

teste.use(express.json());
teste.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
teste.use(acceptedMethod);
teste.use(cookieParser());

teste.use(instalationRouter);
teste.use(routerUser);
teste.use(routerAdmin);
teste.use(routerSystem);
teste.use(router);

teste.use(errorHandling);

export { teste }