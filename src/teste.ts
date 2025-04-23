import express from 'express';
import { existsSync } from "fs";
import { resolve } from 'path';

import { router } from './routes/router';
import { instalationRouter } from './routes/installation';
import errorHandling from './middlewares/errorHandling';

export const teste = express();

teste.use(express.json());

if(existsSync(resolve(__dirname, '..', 'config.json')) === false){
    teste.use(instalationRouter);
}
else{
    teste.use(router);
}

teste.use(errorHandling);