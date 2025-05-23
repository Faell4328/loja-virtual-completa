import DatabaseManager from "./databaseManagerService";

export default function logOutService(userId: string){
    const retornDataBase = DatabaseManager.logOut(userId);
    if(retornDataBase != undefined && retornDataBase != null){
        return 'ok';
    }
        return 'error';
}