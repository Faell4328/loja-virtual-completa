import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isNotLogged from '../middlewares/isNotLogged';
import { validateEmail,validatePassword } from '../middlewares/validatorInput';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import { passwordRecoveryConfirmationController, passwordRecoveryController } from '../controllers/email/passwordRecoveryController';

const router = Router();

const upload = multer(uploadConfig.upload());

router.post('/recuperacao/senha', regularlCondicionalRoutes, isNotLogged, upload.none(), validateEmail, (req: Request, res: Response) => {
    passwordRecoveryController(req, res);
    return;
});

router.put('/recuperacao/senha/:hash', regularlCondicionalRoutes, isNotLogged, upload.none(), validatePassword, (req: Request, res: Response) => {
    passwordRecoveryConfirmationController(req, res);
    return;
})

export { router };