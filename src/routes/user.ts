import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isLogged from '../middlewares/isLogged';
import listUserInformationController from '../controllers/user/listUserInformationController';
import { validateUpdateInformationUser } from '../middlewares/validatorInput';
import uploadUserInformationController from '../controllers/user/uploadUserInformationController';
import deleteUserAddressInformationController from '../controllers/user/deleteUserAddressInformationController';

const routerUser = Router();

const upload = multer(uploadConfig.upload());

routerUser.get('/usuario', isLogged, (req: Request, res: Response) => {
    listUserInformationController(req, res);
    return;
});

routerUser.put('/usuario', isLogged, upload.none(), validateUpdateInformationUser, (req: Request, res: Response) => {
    uploadUserInformationController(req, res);
    return;
});

routerUser.delete('/usuario/endereco', isLogged, (req: Request, res: Response) => {
    deleteUserAddressInformationController(req, res);
    return;
});

export { routerUser };