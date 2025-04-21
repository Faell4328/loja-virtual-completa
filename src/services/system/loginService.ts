import HashPassword from "../../security/hashPassword";
import DatabaseManager from "../databaseManagerService";

export default async function loginService(email: string, password: string){
    let user = await DatabaseManager.consultByEmail(email);

    if(user.length === 0){
        return false;
    }

    const { password: hashPassword } = user[0];
    let retorno = await HashPassword.checkHash(password, hashPassword);
    if(!retorno){
        return false;
    }

    DatabaseManager.login({ email, hashPassword });
    return true;
}