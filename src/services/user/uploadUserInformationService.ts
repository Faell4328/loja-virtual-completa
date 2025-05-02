import DatabaseManager from "../databaseManagerService";

export default async function uploadUserInformationService(userId: string, description: string, phone: string, street: string, number: string, neighborhood: string, zipCode: string, state: string, complement: string){
    const statusUpdate = await DatabaseManager.updateInformationUser(userId, phone, description, street, number, neighborhood, zipCode, state, complement);
    return statusUpdate;
}