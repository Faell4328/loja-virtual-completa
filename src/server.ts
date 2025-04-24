import express from 'express';
import { existsSync } from "fs";
import { resolve } from 'path';

import { router } from './routes/router';
import { instalationRouter } from './routes/installation';
import errorHandling from './middlewares/errorHandling';
import sanitize from './security/sanitizeHTML';

const app = express();

app.use(express.json());

if(existsSync(resolve(__dirname, '..', 'config.json')) === false){
    app.use(instalationRouter);
}
else{
    app.use(router);
}

app.use(errorHandling);
app.listen(3000, ()=>console.log('rodando'))