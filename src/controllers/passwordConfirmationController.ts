import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import passwordConfirmationService from '../services/email/passwordConfirmationService';

export default async function passwordConfirmationController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'erro': errors.errors[0].msg });
    }

    const { password1, password2 } = req.body;

    if(password1 != password2){
        res.status(400).json({ 'erro': 'As senhas estão diferentes' });
        return;
    }

    const serviceReturn = await passwordConfirmationService(req.params.hash, password1);

    res.status(200).json({ 'ok': serviceReturn });
    return;
}