import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';

import emailConfirmationController from '../controllers/emailConfirmationController';
import registrerUserController from '../controllers/createUserController';
import loginController from '../controllers/loginController';
import isNotLogged from '../middlewares/isNotLogged';
import isLogged from '../middlewares/isLogged';
import { validateLogin, validateRegister } from '../middlewares/validatorInput';
import { loginLimit, emailConfirmationLimit } from '../security/requestLimit';

const router = Router();

const upload = multer(uploadConfig.upload());

router.get('/', (req: Request, res: Response) => {
    res.send('opa, tá rodando. Página home');
    return;
});

router.get('/confirmacao', isNotLogged, (req: Request, res: Response) => {
    res.send('Por favor, verifique o email que foi enviado para você com o link para ativação');
    return;
});

router.get('/confirmacao/:hash', emailConfirmationLimit, isNotLogged, (req: Request, res: Response) => {
    emailConfirmationController(req, res);
    return;
});

router.post('/login', loginLimit, isNotLogged, upload.none(), validateLogin, (req: Request, res: Response) => {
    loginController(req, res);
    return;
});

router.post('/cadastrar', isNotLogged, upload.none(), validateRegister, (req: Request, res: Response) => {
    registrerUserController(req, res);
    return;
});

router.post('/admin', isAdmin, (req: Request, res: Response) => {
    return;
});

router.use((req: Request, res: Response) => {
    res.status(404).json({"error": "not found"});
    return;
});

export { router };