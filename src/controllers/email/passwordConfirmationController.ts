import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import passwordConfirmationService from '../../services/email/passwordConfirmationService';

export default async function passwordConfirmationController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'error': errors.errors[0].msg });
    }

    const { password1, password2 } = req.body;

    if(password1 != password2){
        res.status(400).json({ 'error': 'As senhas estão diferentes' });
        return;
    }

    const serviceReturn = await passwordConfirmationService(req.params.hash, password1);

    if(serviceReturn == 'Token expirado, foi enviado para seu email um novo link'){
        res.status(400).json({ 'error': serviceReturn });
        return;
    }

    res.status(200).json({ 'ok': serviceReturn });
    return;
}