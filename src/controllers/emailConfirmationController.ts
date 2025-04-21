import { Request, Response } from 'express';

import checkEmailService from '../services/email/checkEmailService';

export default async function emailConfirmation(req: Request, res: Response){
    let retorno = await checkEmailService(req.params.hash);
    res.send(retorno);
    return;
}