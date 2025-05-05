import DatabaseManager from "../databaseManagerService";

export default async function deleteUserAddressInformationService(userId: string){
    const checkAddress = await DatabaseManager.checkExistingAddress(userId);

    if(checkAddress == false) return false;

    const addressDeletionStatus = await DatabaseManager.deleteUserAddress(userId);

    return addressDeletionStatus == null ? false : true;
}