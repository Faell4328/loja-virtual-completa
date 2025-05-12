import { Request, Response, Router } from 'express';
import multer from 'multer';
import eventBus from '../server';

import uploadConfig from '../config/multer';
import { setQrcode } from './admin';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';

const routerSystem = Router();

const upload = multer(uploadConfig.upload());

routerSystem.post('/webhook/whatsapp', regularlCondicionalRoutes, upload.none(), (req: Request, res: Response) => {
    if(req.body.token == '123'){
        eventBus.emit('qrcode_update', req.body.data);
        setQrcode(req.body.data);
    }
});

export { routerSystem }