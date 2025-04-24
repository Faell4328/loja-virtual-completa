import { Request, Response } from 'express';

import checkEmailService from '../services/email/checkEmailService';
import sanitize from '../security/sanitizeHTML';

export default async function emailConfirmationController(req: Request, res: Response){
    let retorno = await checkEmailService(sanitize(req.params.hash));
    res.send(retorno);
    return;
}