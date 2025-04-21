import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { resolve } from 'path';

import DatabaseManager from '../databaseManagerService';
import HashPassword from '../../security/hashPassword';
import sendEmail from '../email/sendEmailService';

export default async function createrUserAdminService(req: Request, res: Response){
    if(!existsSync(resolve(__dirname, '..', '..', '..', 'config.json'))){
        res.status(307).json({ 'redirect': '/instalacao/config' });
        return;
    }

    const { name, email, password } = req.body;

    if(!name){
        res.status(400).json({ 'erro': 'Falta o nome'});
    }
    else if(!email){
        res.status(400).json({ 'erro': 'Falta o email'});
    }
    else if(!password){
        res.status(400).json({ 'erro': 'Falta o password'});
    }
    else{
        let hashPassword:string = await HashPassword.passwordHashGenerator(password);
        await DatabaseManager.createUserAdmin({ name, email, hashPassword });

        let hashEmail = await DatabaseManager.createEmailToken({ email, hashPassword });
        sendEmail.sendEmailConfirmationService(email, hashEmail);

        res.status(200).json({ 'ok': 'Conta criada, o servidor será reiniciado em 5 segundos. Foi enviado um email para confirmar seu email.' });
        setTimeout( () => process.exit(0), 5000)
        return;
    }
}