import HashPassword from "../../security/hashPassword";
import DatabaseManager from "../databaseManagerService";
import sendEmail from "./sendEmailService";

export default async function passwordConfirmationService(hash: string, newPassword: string){
    let user = await DatabaseManager.checkPasswordRecovery(hash);

    if(user === null) return 'Token inválido';

    const { id, email, resetPasswordTokenExpirationDate } = user;

    if(resetPasswordTokenExpirationDate === null || resetPasswordTokenExpirationDate < new Date()){
        const recoveryHash:string = await DatabaseManager.passwordRecovery(email);
        sendEmail.sendEmailRecoveryPassword(email, recoveryHash);
        return 'Token expirado, foi enviado para seu email um novo link';
    }

    const hashNewPassword: string = await HashPassword.passwordHashGenerator(newPassword);
    await DatabaseManager.passwordRecoveryConfirmed(id, hashNewPassword);

    return 'Senha alterada, vá para login e realizar seu login';
}