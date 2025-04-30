import DatabaseManager from "../databaseManagerService";
import sendEmail from "./sendEmailService";

export default async function resendEmailService(email: string){
    const returnDB = await DatabaseManager.consultByEmail(email);

    if(returnDB === null){
        return 'Esse email não está cadastrado';
    }else if(returnDB.emailConfirmationToken === null && returnDB.emailConfirmationTokenExpirationDate === null){
        return 'Email já validado';
    }
    else{
        let hashEmail = await DatabaseManager.createEmailToken(email);
        sendEmail.sendEmailConfirmationService(email, hashEmail);
        return `Foi reenviado para seu email: ${email}`;
    }
}