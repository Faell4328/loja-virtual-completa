import emailConfirmation from "../controllers/emailConfirmationController";
import prismaClient from "../prisma";
import crypto from 'crypto';

interface AddingInformationSystemProps{
    name: string,
    email: string,
    hashPassword: string
}

interface CreateEmailTokenProps{
    email: string,
    hashPassword: string
}

interface LoginProps{
    email: string,
    hashPassword: string
}
export default class DatabaseManager{

    static async addSystemConfiguration(nameStore: string, fileSoon: string){
        await prismaClient.systemConfig.create({ data: { nameStore, fileSoon, CreationDate: new Date() } })
    }

    static async createUserAdmin({ name, email, hashPassword }: AddingInformationSystemProps){
        const userAdmin = await prismaClient.user.create({
            data: {name, email, password: hashPassword, role: 'ADMIN'}
        })

        if(!userAdmin) console.log('erro ao salvar');
        await this.createEmailToken({ email, hashPassword });
        return;
    }

    static async createUser(name: string, email: string, hashPassword: string){
        try{
            const user = await prismaClient.user.create({
                data: {name, email, password: hashPassword}
            })

            if(!user) console.log('erro ao salvar');
            await this.createEmailToken({ email, hashPassword });
            return;
        }
        catch(error){
            console.log(error);
        }
    }

    static async createEmailToken({ email, hashPassword }: CreateEmailTokenProps){
        const date = new Date();
        date.setHours(date.getHours() + 1);
        let hash = crypto.randomBytes(64).toString('hex');
        const createEmailToken = await prismaClient.user.update({
            where: { email, password: hashPassword },
            data: { emailConfirmationToken: hash, emailConfirmationTokenExpirationDate: date }
        });

        if(!createEmailToken) console.log('erro ao criar o token de login');
        return hash;
    }

    static async checkEmailToken(hash :string){
        let user = await prismaClient.user.findMany({
            where: { emailConfirmationToken: hash }
        });
        return user;
    }

    static async tokenEmailConfirmed(userId: string){
        await prismaClient.user.update({
            where: { id: userId,},
            data: {  emailConfirmationToken:null, emailConfirmationTokenExpirationDate: null, status: 'OK' }
        });
        return true;
    }

    static async login ({ email, hashPassword }: LoginProps){
        const date = new Date();
        date.setDate(date.getDate() + 20);
        let hash = crypto.randomBytes(64).toString('hex');
        const createLoginToken = await prismaClient.user.update({
            where: { email, password: hashPassword },
            data: { loginToken: hash, loginTokenExpirationDate: date }
        });

        if(!createLoginToken) console.log('erro ao criar o token de login');
        return hash;
    }

    static async validateToken(token: string){
        return await prismaClient.user.findMany({
            where: { loginToken: token }
        });
    }

    static async consultByEmail(email: string){
        let user = await prismaClient.user.findMany({
            where: { email }
        });
        return user;
    }

    static async checkEmailExists(email: string){
        let user = await prismaClient.user.findUnique({
            where: { email },
            select: { email: true }
        });

        if(user === null){
            return true;
        } 
        return false;
    }
}