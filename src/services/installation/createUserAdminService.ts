import DatabaseManager from '../system/databaseManagerService';
import HashPassword from '../../security/hashPassword';
import sendEmail from '../email/sendEmailPattern';

export default async function createrUserAdminService(name: string, email: string, phone: string, password: string){
    let hashPassword:string = await HashPassword.passwordHashGenerator(password);
    await DatabaseManager.createUserAdmin(name, email, phone, hashPassword);

    let hashEmail = await DatabaseManager.createEmailToken(email);
    sendEmail.sendEmailConfirmationService(email, hashEmail);
}