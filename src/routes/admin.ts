import { Router, Request, Response } from 'express';
import multer from 'multer';
import SSE from 'express-sse';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';

import listUsersController from '../controllers/admin/listUsersController';
import listSpecificUserController from '../controllers/admin/listSpecificUserController';
import whatsappController from '../controllers/admin/whatsAppController';
import generationWhatsappQrcodeService from '../services/whatsapp/generationWhatsappQrcodeService';
import sendMessageWhatappService from '../services/whatsapp/sendMessageWhatsappService';

const routerAdmin = Router();

const upload = multer(uploadConfig.upload());

let qrcode = '';

export function setQrcode(data: string){
    qrcode = data;
}

routerAdmin.get('/admin', isAdmin, (req: Request, res: Response) => {
    res.send('Você tem acesso a rota admin, é necessário estar logado como admin');
    return;
});

routerAdmin.get('/admin/users', isAdmin, (req: Request, res: Response) => {
    listUsersController(req, res);
    return;
});

routerAdmin.get('/admin/user/:id', isAdmin, (req: Request, res: Response) => {
    listSpecificUserController(req, res);
    return
});

routerAdmin.get('/admin/whatsapp', isAdmin, (req: Request, res: Response) => {
    whatsappController(req, res);
    return
});

routerAdmin.get('/admin/whatsapp/qr', isAdmin, (req: Request, res: Response) => {
    let sse = new SSE();
    sse.init(req, res);
    generationWhatsappQrcodeService(sse, res, qrcode);
});

export { routerAdmin, qrcode }