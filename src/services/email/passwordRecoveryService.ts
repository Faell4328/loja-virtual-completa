import { whatsappReady } from "../../routes/admin";
import DatabaseManager from "../system/databaseManagerService";
import sendMessageWhatappService from "../whatsapp/sendMessageWhatsappService";
import sendEmail from "./sendEmailPattern";

export default async function passwordRecoveryService(email: string){
    const returnDB = await DatabaseManager.consultByEmail(email);

    if(returnDB === null){
        return 'Esse email não está cadastrado';
    }

    if(returnDB.phone && whatsappReady){
        sendMessageWhatappService('55'+returnDB.phone, `Olá ${returnDB.name.split(' ')[0]}, foi solicitado a redefinição de senha. Caso não sejá você solicite ajuda ao suporte`);
    }

    const recoveryHash:string = await DatabaseManager.passwordRecovery(email);

    sendEmail.sendEmailRecoveryPassword(email, recoveryHash);
    return `Foi enviado o link para redefinir a senha no seu email: ${email}`;
}