import { Request, Response } from 'express';

import listUserInformationService from '../../services/user/listUserInformationService';

export default async function listUserInformationController(req: Request, res: Response){
    const userInformation = await listUserInformationService(req.userId);

    if(userInformation == null){
        res.status(400).json({ 'error': 'Problema ao listar' });
        return;
    }

    res.status(200).json({ 'ok': userInformation });
    return;
}