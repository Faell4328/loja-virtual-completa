import DatabaseManager from "../databaseManagerService";

export default async function checkEmailService(hash: string){
    let user = await DatabaseManager.checkEmailToken(hash);

    if(user.length == 0) return 'Token inválido';

    const { email, password: hashPassword, emailConfirmationTokenExpirationDate, status } = user[0];

    if(emailConfirmationTokenExpirationDate === null || emailConfirmationTokenExpirationDate < new Date()) return 'Token expirado';
    if(status === null || status !== 'PENDING_VALIDATION_EMAIL' ) return 'Email já validado';

    DatabaseManager.tokenEmailConfirmed(user[0].id);
    DatabaseManager.login({ email, hashPassword })

    return 'Email válidado'
}