import DatabaseManager from "../databaseManagerService";
import sendEmail from "./sendEmailService";

export default async function checkEmailService(hash: string){
    let user = await DatabaseManager.checkEmailToken(hash);

    if(user === null) return 'Token inválido';

    const { email, password: hashPassword, emailConfirmationTokenExpirationDate, status } = user;

    if(emailConfirmationTokenExpirationDate === null || emailConfirmationTokenExpirationDate < new Date()){
        let hashEmail = await DatabaseManager.createEmailToken(email);
        sendEmail.sendEmailConfirmationService(email, hashEmail);
        return 'Token expirado';
    }

    if(status === null || status !== 'PENDING_VALIDATION_EMAIL' ) return 'Email já validado';

    DatabaseManager.tokenEmailConfirmed(user.id);
    const returnDB = await DatabaseManager.login(email, hashPassword);

    return { status: 'Email válidado', token: returnDB.loginToken, expiration: returnDB.loginTokenExpirationDate };
}