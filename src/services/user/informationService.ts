import DatabaseManager from "../system/databaseManagerService";

export async function listUserInformationService(userId: string){
    const information = await DatabaseManager.listInformationUser(userId);

    if(information == null) return null;

    if(Object.keys(information).length > 1){
        const { name, phone } = information.userInformation;
        const address = information.userAddress?.address[0];
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

export async function uploadUserInformationService(userId: string, name: string, phone: string='', description: string, street: string, number: string, neighborhood: string, zipCode: string, city: string, state: string, complement: string){
    const statusUpdateUserInformation = await DatabaseManager.updateUserInformation(userId, name, phone);

    if(description == undefined){
        return true;
    }

    const statusUpdateUserAddress = await DatabaseManager.updateUserAddressInformation(userId, description, street, number, neighborhood, zipCode, city, state, complement)

    return (statusUpdateUserInformation == true && statusUpdateUserAddress == true) ? true : false
}

export async function deleteUserAddressInformationService(userId: string){
    const checkAddress = await DatabaseManager.checkExistingAddress(userId);

    if(checkAddress == false) return false;

    const addressDeletionStatus = await DatabaseManager.deleteUserAddress(userId);

    return addressDeletionStatus == null ? false : true;
}