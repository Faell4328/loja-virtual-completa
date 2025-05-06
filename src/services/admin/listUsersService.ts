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
            users[index].role = 'administrador'
        }
        else{
            users[index].role = 'usuário'
        }

        if(user.status == 'PENDING_VALIDATION_EMAIL'){
            users[index].status = 'pendente validação email'
        }
        else if(user.status == 'OK'){
            users[index].status = 'ok'
        }
        else if(user.status == 'DEVENDO'){
            users[index].status = 'devedor'
        }
        else{
            users[index].status = 'bloqueado'
        }
    })

    return users;
}