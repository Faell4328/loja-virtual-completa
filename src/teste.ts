import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { router } from './routes';
import { userRoute } from './routes/user';
import { adminRoute } from './routes/admin';
import { instalationRoute } from './routes/installation';
import { webhookRoute } from './routes/webhook';
import errorHandling from './middlewares/errorHandling';
import acceptedMethod from './security/acceptedMethods';
import DatabaseManager from './services/system/databaseManagerService';
import { confirmationEmailRoute } from './routes/confirmationEmail';
import { loginAndRegistrationRoute } from './routes/loginAndRegistration';
import { recoveryPasswordRoute } from './routes/recoveryPassword';

const teste = express();

DatabaseManager.checkStatusSystem();

teste.use(express.json());
teste.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
teste.use(acceptedMethod);
teste.use(cookieParser());

teste.use(userRoute);
teste.use(adminRoute);
teste.use(instalationRoute);
teste.use(webhookRoute);
teste.use(confirmationEmailRoute);
teste.use(loginAndRegistrationRoute);
teste.use(recoveryPasswordRoute);
teste.use(router);

teste.use(errorHandling);

export { teste }