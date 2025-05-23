import { whatsappReady } from "../../routes/admin";
import HashPassword from "../../security/hashPassword";
import DatabaseManager from "./databaseManagerService";
import sendMessageWhatappService from "../whatsapp/sendMessageWhatsappService";

export default async function loginService(email: string, password: string){
    let user = await DatabaseManager.consultByEmail(email);

    if(!user){
        return false;
    }

    const { emailConfirmationToken, password: hashPassword } = user;
    if(emailConfirmationToken){
        return 'redirect';
    }

    let retorno = await HashPassword.checkHash(password, hashPassword);
    if(!retorno){
        return false;
    }

    const returnDB = await DatabaseManager.login(email, hashPassword);


    if(user.phone && whatsappReady){
        sendMessageWhatappService('55'+user.phone, `Ola ${user.name.split(' ')[0]}, alguém realizou login em sua conta, caso não seja você, entre em contato com o suporte`);
    }

    return {status: true, token: returnDB.loginToken, expiration: returnDB.loginTokenExpirationDate };
}