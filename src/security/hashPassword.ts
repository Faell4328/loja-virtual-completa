import { hash } from 'bcryptjs';

export default class HashPassword{ 
    static async passwordHashGenerator(password: string){
        const passwordHash: string = await hash(password, 10);
        return passwordHash;
    }

    static async checkHash(hashPassword: string){
        let verificationStatus: boolean = true;
        return verificationStatus;
    }

}