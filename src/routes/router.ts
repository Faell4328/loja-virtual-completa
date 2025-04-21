import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';

import emailConfirmation from '../controllers/emailConfirmationController';
import registrerUserController from '../controllers/createUserController';
import loginController from '../controllers/loginController';

const router = Router();

const upload = multer(uploadConfig.upload());

router.get('/', (req: Request, res: Response) => {
    res.send('opa, tá rodando. Página home');
    return;
});

router.get('/confirmacao/:hash', (req: Request, res: Response) => {
    emailConfirmation(req, res);
    return;
});

router.post('/login', upload.none(), (req: Request, res: Response) => {
    loginController(req, res);
    return;
});

router.post('/admin', isAdmin, (req: Request, res: Response) => {
    return;
});

router.post('/cadastrar', upload.none(),(req: Request, res: Response) => {
    registrerUserController(req, res);
    return;
});

router.use((req: Request, res: Response) => {
    res.status(404).json({"error": "not found"});
    return;
});

export { router };