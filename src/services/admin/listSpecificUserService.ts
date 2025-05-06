import DatabaseManager from "../databaseManagerService";

export default async function listSpecificUserService(userId: string){
    const information = await DatabaseManager.listInformationUser(userId);
    
        if(information == null) return null;
    
        if(Object.keys(information).length > 1){
            const { name, email, phone } = information.userInformation;
            const address = information.userAddress?.address[0];
            return { name, email, phone, address };
        }
        else if(Object.keys(information).length == 1){
            const { name, email, phone } = information.userInformation;
            return { name, email, phone };
        }
        else{
            return null;
        }
}