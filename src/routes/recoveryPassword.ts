import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isNotLogged from '../middlewares/isNotLogged';
import { validateEmail,validatePassword } from '../middlewares/validatorInput';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { passwordRecoveryConfirmationController, passwordRecoveryController } from '../controllers/email/passwordRecoveryController';
import { confirmationLimit, emailLimit } from '../security/requestLimit';

const recoveryPasswordRoute = Router();

const upload = multer(uploadConfig.upload());

recoveryPasswordRoute.post('/recuperacao/senha', regularlCondicionalRoutes, emailLimit,isNotLogged, upload.none(), validateEmail, (req: Request, res: Response) => {
    passwordRecoveryController(req, res);
    return;
});

recoveryPasswordRoute.put('/recuperacao/senha/:hash', regularlCondicionalRoutes, confirmationLimit, isNotLogged, upload.none(), validatePassword, (req: Request, res: Response) => {
    passwordRecoveryConfirmationController(req, res);
    return;
})

export { recoveryPasswordRoute };