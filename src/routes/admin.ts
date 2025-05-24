import { Router, Request, Response } from 'express';

import isAdmin from '../middlewares/isAdmin';

import whatsappController from '../controllers/admin/whatsappController';
import generationWhatsappQrcodeService from '../services/whatsapp/generationWhatsappQrcodeService';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { listSpecificUserController, listUsersController } from '../controllers/admin/userController';

const adminRoute = Router();

let whatsappReady = false;
let qrcode = '';

export function setQrcode(data: string){
    qrcode = data;
}

export function setWhatsappReady(data: boolean){
    whatsappReady = data;
}

adminRoute.get('/admin/usuarios', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    listUsersController(req, res);
    return;
});

adminRoute.get('/admin/usuario/:id', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    listSpecificUserController(req, res);
    return
});

adminRoute.get('/admin/whatsapp', regularlCondicionalRoutes, isAdmin, (req: Request, res: Response) => {
    whatsappController(req, res);
    return
});

adminRoute.get('/admin/whatsapp/qr', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    generationWhatsappQrcodeService(res, qrcode);
});

export { adminRoute, qrcode, whatsappReady }