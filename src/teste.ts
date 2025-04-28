import express from 'express';
import { existsSync } from "fs";
import { resolve } from 'path';
import cors from 'cors';

import { router } from './routes/router';
import { instalationRouter } from './routes/installation';
import errorHandling from './middlewares/errorHandling';
import acceptedMethod from './security/acceptedMethods';

export const teste = express();

teste.use(express.json());

teste.use(express.json());
teste.use(cors({
    methods: ['GET', 'POST', 'PULL', 'DELETE']
}));
teste.use(acceptedMethod);

if(existsSync(resolve(__dirname, '..', 'config.json')) === false){
    teste.use(instalationRouter);
}
else{
    teste.use(router);
}

teste.use(errorHandling);