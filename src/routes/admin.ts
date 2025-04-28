import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';

const routerAdmin = Router();

const upload = multer(uploadConfig.upload());

routerAdmin.post('/admin', isAdmin, (req: Request, res: Response) => {
    res.send('rota admin, deve estar logado e ter permissão de admin');
    return;
});

export { routerAdmin }