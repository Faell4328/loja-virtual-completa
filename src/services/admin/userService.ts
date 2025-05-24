import DatabaseManager from "../system/databaseManagerService";

interface UsersProps{
    name: string;
    phone: string | null;
    email: string;
    role: string;
    status: string
}

export async function listUsersService(){
    let users: boolean | UsersProps[] = await DatabaseManager.listUsers();

    if(typeof(users) == 'boolean') return false;

    users.map((user, index) => {
        if(user.role == 'ADMIN'){
            users[index].role = 'Administrador'
        }
        else{
            users[index].role = 'Usuário'
        }

        if(user.status == 'PENDING_VALIDATION_EMAIL'){
            users[index].status = 'Pendente validação email'
        }
        else if(user.status == 'OK'){
            users[index].status = 'Ok'
        }
        else if(user.status == 'DEVENDO'){
            users[index].status = 'Devedor'
        }
        else{
            users[index].status = 'Bloqueado'
        }
    })

    return users;
}

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

export async function listSpecificUserService(userId: string){
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