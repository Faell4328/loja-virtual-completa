import DatabaseManager from "../databaseManagerService";

function adjustRolePattern(role: string){
    if(role == 'ADMIN'){
        return 'Administrador'
    }
    else{
        return 'Usuário'
    }
}

function adjustStatusPattern(status: string){
    if(status == 'PENDING_VALIDATION_EMAIL'){
        return 'Pendente validação email'
    }
    else if(status == 'OK'){
        return 'Ok'
    }
    else if(status == 'DEVENDO'){
        return 'Devedor'
    }
    else{
        return 'Bloqueado'
    }
}

export default async function listSpecificUserService(userId: string){
    console.log('ok')
    const information = await DatabaseManager.listInformationUser(userId);
    
        if(information == null) return null;

    
        if(Object.keys(information).length > 1){
            let { id, name, email, phone, role, status } = information.userInformation;
            const ajustedRole: string = adjustRolePattern(role);
            const ajustedStatus: string = adjustStatusPattern(status);
            const address = information.userAddress?.address[0];
            return { id, name, email, phone, role: ajustedRole, status: ajustedStatus, address };
        }
        else if(Object.keys(information).length == 1){
            const { id, name, email, phone, role, status } = information.userInformation;
            const ajustedRole: string = adjustRolePattern(role);
            const ajustedStatus: string = adjustStatusPattern(status);
            return { id, name, email, phone, role: ajustedRole, status: ajustedStatus };
        }
        else{
            return null;
        }
}