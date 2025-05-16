import { Router, Request, Response } from 'express';
import multer from 'multer';
import SSE from 'express-sse';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';

import listUsersController from '../controllers/admin/listUsersController';
import listSpecificUserController from '../controllers/admin/listSpecificUserController';
import whatsappController from '../controllers/admin/whatsAppController';
import generationWhatsappQrcodeService from '../services/whatsapp/generationWhatsappQrcodeService';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';

const routerAdmin = Router();

const upload = multer(uploadConfig.upload());

let whatsappReady = false;
let qrcode = '';

export function setQrcode(data: string){
    qrcode = data;
}

export function setWhatsappReady(data: boolean){
    whatsappReady = data;
}

routerAdmin.get('/admin/users', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    listUsersController(req, res);
    return;
});

routerAdmin.get('/admin/user/:id', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    listSpecificUserController(req, res);
    return
});

routerAdmin.get('/admin/whatsapp', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    whatsappController(req, res);
    return
});

routerAdmin.get('/admin/whatsapp/qr', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    let sse = new SSE();
    sse.init(req, res);
    generationWhatsappQrcodeService(sse, res, qrcode);
});

export { routerAdmin, qrcode, whatsappReady }