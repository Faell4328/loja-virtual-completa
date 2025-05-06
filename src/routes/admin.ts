import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';

import listUsersController from '../controllers/admin/listUsersController';
import listSpecificUserController from '../controllers/admin/listSpecificUserController';

const routerAdmin = Router();

const upload = multer(uploadConfig.upload());

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
})

export { routerAdmin }