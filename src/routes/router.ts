import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import emailConfirmationController from '../controllers/email/emailConfirmationController';
import registrerUserController from '../controllers/user/createUserController';
import loginController from '../controllers/system/loginController';
import isNotLogged from '../middlewares/isNotLogged';
import { validateEmail, validateLogin, validatePassword, validateRegister } from '../middlewares/validatorInput';
import { loginLimit, emailConfirmationLimit, resendEmailLimit } from '../security/requestLimit';
import resendEmailController from '../controllers/email/resendEmailController';
import passwordRecoveryController from '../controllers/email/passwordRecoveryController';
import passwordConfirmationController from '../controllers/email/passwordConfirmationController';
import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import DatabaseManager from '../services/databaseManagerService';
import sendResponse from '../controllers/controllerSendPattern';

const router = Router();

const upload = multer(uploadConfig.upload());

router.get('/', regularlCondicionalRoutes, async (req: Request, res: Response) => {
    if(req.cookies['token'] !== undefined && req.cookies['token'].length == 128){
        const user = await DatabaseManager.consultByLoginToken(req.cookies['token']);
        if(user){
            sendResponse(res, null, null, null, user.role)
        }
        else{
            res.end();
        }
    }
    else{
        res.end();
    }
    return;
});

router.get('/confirmacao', regularlCondicionalRoutes, isNotLogged, (req: Request, res: Response) => {
    res.send('Por favor, verifique o email que foi enviado para você com o link para ativação');
    return;
});

// A pessoa deve enviar o email que ela gostaria que fosse reenviado o link de ativação de email na conta
router.post('/confirmacao', regularlCondicionalRoutes, isNotLogged, resendEmailLimit, upload.none(), validateEmail, (req: Request, res: Response) => {
    resendEmailController(req, res);
    return;
});

router.put('/confirmacao/:hash', regularlCondicionalRoutes, isNotLogged, emailConfirmationLimit, (req: Request, res: Response) => {
    emailConfirmationController(req, res);
    return;
});

router.post('/login', regularlCondicionalRoutes, isNotLogged, loginLimit, upload.none(), validateLogin, (req: Request, res: Response) => {
    loginController(req, res);
    return;
});

router.post('/cadastrar', regularlCondicionalRoutes, isNotLogged, upload.none(), validateRegister, (req: Request, res: Response) => {
    registrerUserController(req, res);
    return;
});

router.post('/recuperacao/senha', regularlCondicionalRoutes, isNotLogged, upload.none(), validateEmail, (req: Request, res: Response) => {
    passwordRecoveryController(req, res);
    return;
});

router.post('/recuperacao/senha/:hash', regularlCondicionalRoutes, isNotLogged, upload.none(), validatePassword, (req: Request, res: Response) => {
    passwordConfirmationController(req, res);
    return;
})

router.use(regularlCondicionalRoutes, (req: Request, res: Response) => {
    res.status(404).json({"error": "not found"});
    return;
});

export { router };