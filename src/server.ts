import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/openapi.json';

import { router } from './routes';
import errorHandling from './middlewares/errorHandling';
import acceptedMethod from './security/acceptedMethods';
import DatabaseManager from './services/system/databaseManagerService';
import { userRoute } from './routes/user';
import { adminRoute } from './routes/admin';
import { instalationRoute } from './routes/installation';
import { webhookRoute } from './routes/webhook';
import { confirmationEmailRoute } from './routes/confirmationEmail';
import { loginAndRegistrationRoute } from './routes/loginAndRegistration';

const app = express();

DatabaseManager.checkStatusSystem();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(acceptedMethod);
app.use(cookieParser());

app.use(userRoute);
app.use(adminRoute);
app.use(instalationRoute);
app.use(webhookRoute);
app.use(confirmationEmailRoute);
app.use(loginAndRegistrationRoute);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(router);

app.use(errorHandling);
app.listen(3000, '0.0.0.0', () => console.log('rodando'))