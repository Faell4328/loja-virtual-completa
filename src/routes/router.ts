import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import emailConfirmationController from '../controllers/emailConfirmationController';
import registrerUserController from '../controllers/createUserController';
import loginController from '../controllers/loginController';
import isNotLogged from '../middlewares/isNotLogged';
import { validateEmail, validateLogin, validateRegister } from '../middlewares/validatorInput';
import { loginLimit, emailConfirmationLimit, emailForwardingLimit } from '../security/requestLimit';
import resendEmailController from '../controllers/resendEmailController';

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

// A pessoa deve enviar o email que ela gostaria que fosse reenviado o link de ativação de email na conta
router.post('/confirmacao', isNotLogged, emailForwardingLimit, upload.none(), validateEmail, (req: Request, res: Response) => {
    resendEmailController(req, res);
    return;
});

router.get('/confirmacao/:hash', isNotLogged, emailConfirmationLimit, (req: Request, res: Response) => {
    emailConfirmationController(req, res);
    return;
});

router.post('/login', isNotLogged, loginLimit, upload.none(), validateLogin, (req: Request, res: Response) => {
    loginController(req, res);
    return;
});

router.post('/cadastrar', isNotLogged, upload.none(), validateRegister, (req: Request, res: Response) => {
    registrerUserController(req, res);
    return;
});

router.use((req: Request, res: Response) => {
    res.status(404).json({"error": "not found"});
    return;
});

export { router };