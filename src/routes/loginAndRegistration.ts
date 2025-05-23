import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import registrerUserController from '../controllers/system/registerController';
import loginController from '../controllers/system/loginController';
import isNotLogged from '../middlewares/isNotLogged';
import { validateLogin, validateRegister } from '../middlewares/validatorInput';
import { loginLimit } from '../security/requestLimit';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';

const loginAndRegistrationRoute = Router();

const upload = multer(uploadConfig.upload());

loginAndRegistrationRoute.post('/login', regularlCondicionalRoutes, isNotLogged, loginLimit, upload.none(), validateLogin, (req: Request, res: Response) => {
    loginController(req, res);
    return;
});

loginAndRegistrationRoute.post('/cadastrar', regularlCondicionalRoutes, isNotLogged, upload.none(), validateRegister, (req: Request, res: Response) => {
    registrerUserController(req, res);
    return;
});

export { loginAndRegistrationRoute };