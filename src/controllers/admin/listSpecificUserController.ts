import { Request, Response } from 'express';

import listSpecificUserService from '../../services/admin/listSpecificUserService';

export default async function listSpecificUserController(req: Request, res: Response){
    let user;

    if(req.params.id && (req.params.id).length > 10){
        user = await listSpecificUserService(req.params.id);
    }

    if(!user) return res.status(400).json({ 'error': 'Usuário não encontrado' });
    
    res.status(200).json({ 'ok': user });
    return;
}