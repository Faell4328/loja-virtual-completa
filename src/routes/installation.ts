import { Router, Request, Response } from 'express';
import multer from 'multer';
import { existsSync } from 'fs';
import { resolve } from 'path';

import uploadConfig from '../config/multer';
import createUserAdmin from '../controllers/createUserAdminController';
import configureSystem from '../controllers/configureSystemController';

const instalationRouter = Router();
const upload = multer(uploadConfig.upload());

instalationRouter.post('/instalacao/admin', upload.none(), (req: Request, res: Response) => {
    createUserAdmin(req, res);
})

instalationRouter.post('/instalacao/config', upload.single('file') , (req: Request, res: Response) => {
    configureSystem(req, res);
})

instalationRouter.use((req: Request, res: Response) => {
    if(existsSync(resolve(__dirname, '..', '..', 'config.json'))){
        res.status(307).json({ 'redirect': '/instalacao/admin' });
    }
    else{
        res.status(307).json({ 'redirect': '/instalacao/config' });
    }
})

export { instalationRouter };