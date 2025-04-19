import prismaClient from "../prisma";

interface AddingInformationSystemProps{
    name: string,
    email: string,
    hashPassword: string,
}

export default class DatabaseManager{
    static async createrUserAdmin({ name, email, hashPassword }: AddingInformationSystemProps){
        const userAdmin = await prismaClient.user.create({
            data: {name, email, password: hashPassword, rule: 'ADMIN'}
        })

        if(!userAdmin) console.log('erro ao salvar')
    }
}