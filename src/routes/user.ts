import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isLogged from '../middlewares/isLogged';
import listUserInformationController from '../controllers/user/listUserInformationController';

const routerUser = Router();

const upload = multer(uploadConfig.upload());

routerUser.get('/usuario', isLogged, (req: Request, res: Response) => {
    res.send('Você tem acesso a rota usuário, é necessário estar logado como usuário ou admin');
    return;
});

routerUser.get('/user/me', isLogged, (req: Request, res: Response) => {
    listUserInformationController(req, res);
    return;
});

export { routerUser };