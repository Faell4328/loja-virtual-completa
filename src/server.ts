import express from 'express';
import { existsSync } from "fs";
import { resolve } from 'path';

import { router } from './routes/router';
import { instalationRouter } from './routes/installation';

const app = express();

app.use(express.json());

console.log(existsSync(resolve(__dirname, '..', '..', 'config.json')));

if(existsSync(resolve(__dirname, '..', '..', 'config.json')) === false){
    app.use(instalationRouter);
}
else{
    app.use(router);
}

app.listen(3000, ()=>console.log('rodando'))