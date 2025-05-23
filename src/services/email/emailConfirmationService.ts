import DatabaseManager from "../system/databaseManagerService";
import sendEmail from "./sendEmailPattern";

export async function emailConfirmationService(hash: string){
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

export async function resendEmailConfirmationService(email: string){
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