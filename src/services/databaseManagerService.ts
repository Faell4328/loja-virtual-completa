import prismaClient from "../prisma";
import crypto from 'crypto';
import { statusSystem, setStatus } from "../tools/status";
export default class DatabaseManager{

    static async checkStatusSystem(){
        const quantidade = await prismaClient.systemConfig.count({ where: { id: 1 } })
        if(quantidade == 0){
            return;
        }

        const status = await prismaClient.systemConfig.findMany({
            where: { id: 1 },
            select: { statusSystem: true }
        })
        if(status == null){
            throw new Error('status connot be checked')
        }
        setStatus(status[0].statusSystem)
        return;
    }

    static async addSystemConfiguration(nameStore: string, fileSoon: string){
        await prismaClient.systemConfig.create({ data: { nameStore, fileSoon, statusSystem, creationDate: new Date() } })
    }

    static async createUserAdmin(name: string, email: string, phone: string, hashPassword: string){
        const userAdmin = await prismaClient.user.create({
            data: {name, email, phone, password: hashPassword, role: 'ADMIN'}
        })
        await prismaClient.systemConfig.update({
            where: {id: 1},
            data: { statusSystem }
        });

        if(!userAdmin) console.log('erro ao salvar');
        return;
    }

    static async createUser(name: string, email: string, phone: string, hashPassword: string){
        try{
            const user = await prismaClient.user.create({
                data: {name, email, phone, password: hashPassword}
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
        date.setMinutes(date.getMinutes() + 5);
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
        date.setMinutes(date.getMinutes() + 5);
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

    static async login (email: string, hashPassword: string){
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
    
    static async consultByLoginToken(token: string){
        let user = await prismaClient.user.findUnique({
            where: { loginToken: token }
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
            select: { id: true, name: true, email: true, phone: true, role: true, status: true }
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
                select: { description: true, street: true, number: true, neighborhood: true, zipCode: true, city: true, state: true, complement: true }
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

    static async updateUserAddressInformation(userId: string, description: string, street: string, number: string, neighborhood: string, zipCode: string, city: string, state: string, complement: string){
        

        const countAddress = await prismaClient.address.count({
            where: { usersId: userId }
        });

        if(countAddress == 0){
            await prismaClient.address.create({
                data: { usersId: userId, description, street, number, neighborhood, zipCode, city, state, complement },
                select: { description: true, street: true, number: true, neighborhood: true, zipCode: true, city: true, state: true, complement: true }
            });
            return true;
        }
        else if(countAddress > 0){
            await prismaClient.address.update({
                where: { usersId: userId },
                data: { description, street, number, neighborhood, zipCode, city, state, complement },
                select: { description: true, street: true, number: true, neighborhood: true, zipCode: true, city: true, state: true, complement: true }
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
            select: { id: true, name: true, email: true, phone: true, role: true, status: true }
        });
        return users == null ? false : users;
    }

}