import express from 'express';
import { existsSync } from "fs";
import { resolve } from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { router } from './routes/router';
import { routerUser } from './routes/user';
import { routerAdmin } from './routes/admin';
import { instalationRouter } from './routes/installation';
import errorHandling from './middlewares/errorHandling';
import acceptedMethod from './security/acceptedMethods';

const app = express();

app.use(express.json());
app.use(cors({
    methods: ['GET', 'POST', 'PULL', 'DELETE']
}));
app.use(acceptedMethod);
app.use(cookieParser());

if(existsSync(resolve(__dirname, '..', 'config.json')) === false){
    app.use(instalationRouter);
}
else{
    app.use(routerUser);
    app.use(routerAdmin);
    app.use(router);
}

app.use(errorHandling);
app.listen(3000, ()=>console.log('rodando'))