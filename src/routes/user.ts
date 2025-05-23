import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import isLogged from '../middlewares/isLogged';
import { validateUpdateInformationUser } from '../middlewares/validatorInput';
import { deleteUserAddressInformationController, listUserInformationController, uploadUserInformationController } from '../controllers/user/informationController';

const userRoute = Router();

const upload = multer(uploadConfig.upload());

userRoute.get('/usuario', isLogged, (req: Request, res: Response) => {
    listUserInformationController(req, res);
    return;
});

userRoute.put('/usuario', isLogged, upload.none(), validateUpdateInformationUser, (req: Request, res: Response) => {
    uploadUserInformationController(req, res);
    return;
});

userRoute.delete('/usuario/endereco', isLogged, (req: Request, res: Response) => {
    deleteUserAddressInformationController(req, res);
    return;
});

export { userRoute };