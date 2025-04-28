import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isLogged from '../middlewares/isLogged';

const routerUser = Router();

const upload = multer(uploadConfig.upload());

routerUser.post('/usuario', isLogged, (req: Request, res: Response) => {
    res.send('rota usuário, deve estar logado');
    return;
});

export { routerUser };