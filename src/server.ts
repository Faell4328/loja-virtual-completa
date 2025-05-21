import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/openapi.json';

import { router } from './routes/router';
import { routerUser } from './routes/user';
import { routerAdmin } from './routes/admin';
import { instalationRouter } from './routes/installation';
import { routerSystem } from './routes/system';
import errorHandling from './middlewares/errorHandling';
import acceptedMethod from './security/acceptedMethods';
import DatabaseManager from './services/databaseManagerService';

const app = express();

DatabaseManager.checkStatusSystem();

app.use(express.json());
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(acceptedMethod);
app.use(cookieParser());

app.use(instalationRouter);
app.use(routerUser);
app.use(routerAdmin);
app.use(routerSystem);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(router);

app.use(errorHandling);
app.listen(3000, '0.0.0.0', () => console.log('rodando'))