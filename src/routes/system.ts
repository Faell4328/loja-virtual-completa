import { Request, Response, Router } from 'express';
import multer from 'multer';
import eventBus from '../server';

import uploadConfig from '../config/multer';
import { setQrcode, setWhatsappReady } from './admin';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';

const routerSystem = Router();

const upload = multer(uploadConfig.upload());

routerSystem.post('/webhook/whatsapp', regularlCondicionalRoutes, upload.none(), (req: Request, res: Response) => {
    if(req.body.token == process.env.TOKEN_WEB_HOOK){
        if(req.body.data == 'Pronto'){
            setWhatsappReady(true);
            setQrcode('')
            return;
        }
        setQrcode(req.body.data);
        eventBus.emit('qrcode_update', req.body.data);
    }
});

export { routerSystem }