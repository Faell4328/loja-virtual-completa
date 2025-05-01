import DatabaseManager from "../databaseManagerService";
import sendEmail from "./sendEmailService";

export default async function passwordRecoveryService(email: string){
    const returnDB = await DatabaseManager.consultByEmail(email);

    if(returnDB === null){
        return 'Esse email não está cadastrado';
    }

    const recoveryHash:string = await DatabaseManager.passwordRecovery(email);

    sendEmail.sendEmailRecoveryPassword(email, recoveryHash);
    return `Foi enviado o link para redefinir a senha no seu email: ${email}`;
}