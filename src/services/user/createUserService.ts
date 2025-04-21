import DatabaseManager from '../databaseManagerService';
import HashPassword from '../../security/hashPassword';
import sendEmail from '../email/sendEmailService';

export default async function createUserService(name: string, email: string, password: string){
    let hashPassword:string = await HashPassword.passwordHashGenerator(password);
    await DatabaseManager.createUser(name, email, hashPassword);

    let hashEmail = await DatabaseManager.createEmailToken({ email, hashPassword });
    sendEmail.sendEmailConfirmationService(email, hashEmail);

    return true;
}