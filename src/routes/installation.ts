import { Router, Request, Response } from 'express';
import multer from 'multer';

import uploadConfig from '../config/multer';
import InstallationSystem from '../controllers/installationSystem';

const instalationRouter = Router();
const upload = multer(uploadConfig.upload());

instalationRouter.post('/instalacao/admin', upload.none(), (req: Request, res: Response) => {
    InstallationSystem.createUserAdmin(req, res);
})

instalationRouter.post('/instalacao/config', upload.single('file') , (req: Request, res: Response) => {
    InstallationSystem.configureSystem(req, res);
})

instalationRouter.use((req: Request, res: Response) => {
    InstallationSystem.routerDefault(req, res);
})

export { instalationRouter };