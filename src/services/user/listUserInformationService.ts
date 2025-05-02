import DatabaseManager from "../databaseManagerService";

export default async function listUserInformationService(loginToken: string){
    const information = await DatabaseManager.listInformationUser(loginToken);

    if(information == null) return null;

    if(Object.keys(information).length > 1){
        const { name, phone } = information.userInformation;
        const address = information.userAddress?.address;
        return { name, phone, address };
    }
    else if(Object.keys(information).length == 1){
        const { name, phone } = information.userInformation;
        return { name, phone };
    }
    else{
        return null;
    }
}