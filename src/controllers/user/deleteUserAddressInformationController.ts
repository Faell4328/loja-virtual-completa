import { Request, Response } from 'express';

import deleteUserAddressInformationService from '../../services/user/deleteUserAddressInformationService';

export default async function deleteUserAddressInformationController(req: Request, res: Response){
    const statusAddress = await deleteUserAddressInformationService(req.userId);
    if(statusAddress == false){
        res.status(400).json({ 'error': 'Você não possui endereço cadastrado' });
        return;
    }
    res.status(200).json({ 'ok': 'Endereço deletado' });
    return;
}