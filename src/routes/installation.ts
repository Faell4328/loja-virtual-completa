import { Router, Request, Response } from 'express';
import multer from 'multer';
import { existsSync } from 'fs';
import { resolve } from 'path';

import uploadConfig from '../config/multer';
import createUserAdminController from '../controllers/createUserAdminController';
import configureSystemController from '../controllers/configureSystemController';
import { validateRegister, validateSystemConfig } from '../middlewares/validatorInput';

const instalationRouter = Router();
const upload = multer(uploadConfig.upload());

instalationRouter.post('/instalacao/admin', upload.none(), validateRegister, (req: Request, res: Response) => {
    createUserAdminController(req, res);
})

instalationRouter.post('/instalacao/config', upload.single('file'), validateSystemConfig, (req: Request, res: Response) => {
    configureSystemController(req, res);
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