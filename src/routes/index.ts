import { Router, Request, Response } from 'express';

import { regularlCondicionalRoutes } from '../middlewares/condicionalRoutes';
import DatabaseManager from '../services/system/databaseManagerService';
import serverSendingPattern from '../controllers/serverSendingPattern';

const router = Router();

router.get('/', regularlCondicionalRoutes, async (req: Request, res: Response) => {
    if(req.cookies['token'] !== undefined && req.cookies['token'].length == 128){
        const user = await DatabaseManager.consultByLoginToken(req.cookies['token']);
        if(user){
            serverSendingPattern(res, null, null, null, user.role)
        }
        else{
            serverSendingPattern(res, null, null, null, null);
        }
    }
    else{
        res.end();
    }
    return;
});

router.use(regularlCondicionalRoutes, (req: Request, res: Response) => {
    res.status(404).json({"error": "not found"});
    return;
});

export { router };