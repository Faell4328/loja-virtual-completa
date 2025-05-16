import DatabaseManager from "../databaseManagerService";

interface UsersProps{
    name: string;
    phone: string | null;
    email: string;
    role: string;
    status: string
}

export default async function listUsersService(){
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