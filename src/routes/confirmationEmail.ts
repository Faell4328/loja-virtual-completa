import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isNotLogged from '../middlewares/isNotLogged';
import { validateEmail } from '../middlewares/validatorInput';
import { emailConfirmationLimit, resendEmailLimit } from '../security/requestLimit';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { emailConfirmationController, resendEmailConfirmationController } from '../controllers/email/emailConfirmationController';

const confirmationEmailRoute = Router();

const upload = multer(uploadConfig.upload());


confirmationEmailRoute.post('/confirmacao', regularlCondicionalRoutes, isNotLogged, resendEmailLimit, upload.none(), validateEmail, (req: Request, res: Response) => {
    resendEmailConfirmationController(req, res);
    return;
});

confirmationEmailRoute.put('/confirmacao/:hash', regularlCondicionalRoutes, isNotLogged, emailConfirmationLimit, (req: Request, res: Response) => {
    emailConfirmationController(req, res);
    return;
});

export { confirmationEmailRoute };