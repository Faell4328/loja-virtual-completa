import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import createUserAdminController from '../controllers/admin/createUserAdminController';
import configureSystemController from '../controllers/system/configureSystemController';
import { validateRegister, validateSystemConfig } from '../middlewares/validatorInput';
import { conditionalInstalationRoutes } from '../middlewares/condicionalRoutes';

const instalationRouter = Router();
const upload = multer(uploadConfig.upload(true));

instalationRouter.post('/instalacao/admin', conditionalInstalationRoutes, upload.none(), validateRegister, (req: Request, res: Response) => {
    createUserAdminController(req, res);
    return
})

instalationRouter.post('/instalacao/config', conditionalInstalationRoutes, upload.single('file'), validateSystemConfig, (req: Request, res: Response) => {
    configureSystemController(req, res);
    return;
})

export { instalationRouter };