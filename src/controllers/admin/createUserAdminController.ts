import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import createrUserAdminService from '../../services/admin/createUserAdminService';
import { setStatus, statusSystem } from '../../server';

export default async function createUserAdminController(req: Request, res: Response){

    if(statusSystem < 1){
        res.status(307).json({ 'redirect': '/instalacao/config' });
        return;
    }

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'error': errors.errors[0].msg });
    }

    const { name, email, phone, password } = req.body;
    
    setStatus(2);
    await createrUserAdminService(name, email, phone, password);

    res.status(307).json({ 'redirect': '/confirmacao' });
    return;
}