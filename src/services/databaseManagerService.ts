import prismaClient from "../prisma";
import crypto from 'crypto';

interface AddingInformationSystemProps{
    name: string,
    email: string,
    hashPassword: string
}

interface LoginProps{
    email: string,
    hashPassword: string
}
export default class DatabaseManager{

    static async addSystemConfiguration(nameStore: string, fileSoon: string){
        await prismaClient.systemConfig.create({ data: { nameStore, fileSoon, creationDate: new Date() } })
    }

    static async createUserAdmin({ name, email, hashPassword }: AddingInformationSystemProps){
        const userAdmin = await prismaClient.user.create({
            data: {name, email, password: hashPassword, role: 'ADMIN'}
        })

        if(!userAdmin) console.log('erro ao salvar');
        return;
    }

    static async createUser(name: string, email: string, hashPassword: string){
        try{
            const user = await prismaClient.user.create({
                data: {name, email, password: hashPassword}
            })

            if(!user) console.log('erro ao salvar');
            return;
        }
        catch(error){
            console.log(error);
        }
    }

    static async createEmailToken(email: string){
        const date = new Date();
        date.setHours(date.getHours() + 1);
        let hash = crypto.randomBytes(64).toString('hex');
        const createEmailToken = await prismaClient.user.update({
            where: { email },
            data: { emailConfirmationToken: hash, emailConfirmationTokenExpirationDate: date },
        });

        if(!createEmailToken) console.log('erro ao criar o token de login');
        return hash;
    }

    static async checkEmailToken(hash :string){
        let user = await prismaClient.user.findUnique({
            where: { emailConfirmationToken: hash }
        });
        return user;
    }

    static async tokenEmailConfirmed(userId: string){
        await prismaClient.user.update({
            where: { id: userId,},
            data: { emailConfirmationToken:null, emailConfirmationTokenExpirationDate: null, status: 'OK' }
        });
        return true;
    }


    static async passwordRecovery(email: string){
        const date = new Date();
        date.setMinutes(date.getMinutes() + 30);
        let hash = crypto.randomBytes(64).toString('hex');

        let token = await prismaClient.user.update({
            where: { email },
            data: { resetPasswordToken: hash, resetPasswordTokenExpirationDate: date },
            select: { resetPasswordToken: true }
        })

        if(!token) console.log('erro ao criar o token de login');
        return hash;
    }

    static async checkPasswordRecovery(hash: string){
        let user = await prismaClient.user.findUnique({
            where: { resetPasswordToken: hash }
        });

        return user;
    }

    static async passwordRecoveryConfirmed(userId: string, newHashPassword: string){
        await prismaClient.user.update({
            where: { id: userId,},
            data: { password: newHashPassword, resetPasswordToken:null, resetPasswordTokenExpirationDate:null }
        });
        return true;
    }

    static async login ({ email, hashPassword }: LoginProps){
        const date = new Date();
        date.setDate(date.getDate() + 20);
        let hash = crypto.randomBytes(64).toString('hex');
        const createLoginToken = await prismaClient.user.update({
            where: { email, password: hashPassword },
            data: { loginToken: hash, loginTokenExpirationDate: date },
            select: { loginToken: true, loginTokenExpirationDate: true }
        });

        if(!createLoginToken) console.log('erro ao criar o token de login');
        return createLoginToken;
    }

    static async validateLoginToken(token: string){
        return await prismaClient.user.findUnique({
            where: { loginToken: token }
        });
    }

    static async consultByEmail(email: string){
        let user = await prismaClient.user.findUnique({
            where: { email }
        });
        return user;
    }

    static async checkExistingAddress(userId: string){
        const count = await prismaClient.address.count({
            where: { usersId: userId }
        });

        return (count == 0) ? false : true;
    }

    static async listInformationUser(userId: string){

        const userInformation = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, phone: true}
        });

        if(userInformation == null) return null;

        const addressQuantity = await this.checkExistingAddress(userId);
        if(addressQuantity== false) return {userInformation};

        const userAddress = await this.listInformationAddress(userId);

        return { userInformation, userAddress };
    }

    static async listInformationAddress(userId: string){

        const userAddress = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { address: {
                select: { description: true, street: true, number: true, neighborhood: true, zipCode: true, complement: true }
            }}
        });

        return userAddress;
    }

    static async updateUserInformation(userId: string, name: string, phone: string){
        await prismaClient.user.update({
            where: { id: userId },
            data: { name, phone }
        });

        return true;
    }

    static async updateUserAddressInformation(userId: string, description: string, street: string, number: string, neighborhood: string, zipCode: string, state: string, complement: string){
        

        const countAddress = await prismaClient.address.count({
            where: { usersId: userId }
        });

        if(countAddress == 0){
            await prismaClient.address.create({
                data: { usersId: userId, description, street, number, neighborhood, zipCode, state, complement },
                select: { description: true, street: true, number: true, neighborhood: true, zipCode: true, state: true, complement: true }
            });
            return true;
        }
        else if(countAddress > 0){
            await prismaClient.address.update({
                where: { usersId: userId },
                data: { description, street, number, neighborhood, zipCode, state, complement },
                select: { description: true, street: true, number: true, neighborhood: true, zipCode: true, state: true, complement: true }
            });
            return true;
        }
        else{
            return false;
        }
    }

    static async deleteUserAddress(userId: string){
        const status = await prismaClient.address.delete({
            where: { usersId: userId }
        });

        return status;
    }

    static async listUsers(){
        const users = await prismaClient.user.findMany({
            select: { id: true, name: true, phone: true, email: true, role: true, status: true }
        });
        return users == null ? false : users;
    }
}