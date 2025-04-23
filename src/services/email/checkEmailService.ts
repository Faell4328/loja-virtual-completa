import DatabaseManager from "../databaseManagerService";
import sendEmail from "./sendEmailService";

export default async function checkEmailService(hash: string){
    let user = await DatabaseManager.checkEmailToken(hash);

    if(user === null) return 'Token inválido';

    const { email, password: hashPassword, emailConfirmationTokenExpirationDate, status } = user;

    if(emailConfirmationTokenExpirationDate === null || emailConfirmationTokenExpirationDate < new Date()){
        let hashEmail = await DatabaseManager.createEmailToken({ email, hashPassword });
        sendEmail.sendEmailConfirmationService(email, hashEmail);
        return 'Token expirado, foi enviado para seu email um novo token';
    }

    if(status === null || status !== 'PENDING_VALIDATION_EMAIL' ) return 'Email já validado';

    DatabaseManager.tokenEmailConfirmed(user.id);
    DatabaseManager.login({ email, hashPassword })

    return 'Email válidado'
}