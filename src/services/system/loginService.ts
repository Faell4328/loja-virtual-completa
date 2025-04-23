import HashPassword from "../../security/hashPassword";
import DatabaseManager from "../databaseManagerService";

export default async function loginService(email: string, password: string){
    let user = await DatabaseManager.consultByEmail(email);

    if(!user){
        return false;
    }

    const { emailConfirmationToken, password: hashPassword } = user;
    if(emailConfirmationToken){
        return 'redirect';
    }

    let retorno = await HashPassword.checkHash(password, hashPassword);
    if(!retorno){
        return false;
    }

    DatabaseManager.login({ email, hashPassword });
    return true;
}