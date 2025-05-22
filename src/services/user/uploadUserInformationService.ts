import DatabaseManager from "../databaseManagerService";

export default async function uploadUserInformationService(userId: string, name: string, phone: string='', description: string, street: string, number: string, neighborhood: string, zipCode: string, city: string, state: string, complement: string){
    const statusUpdateUserInformation = await DatabaseManager.updateUserInformation(userId, name, phone);

    if(description == undefined){
        return true;
    }

    const statusUpdateUserAddress = await DatabaseManager.updateUserAddressInformation(userId, description, street, number, neighborhood, zipCode, city, state, complement)

    return (statusUpdateUserInformation == true && statusUpdateUserAddress == true) ? true : false
}