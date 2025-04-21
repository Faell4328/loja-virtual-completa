import { hash, compare } from 'bcryptjs';

export default class HashPassword{ 
    static async passwordHashGenerator(password: string){
        const passwordHash: string = await hash(password, 10);
        return passwordHash;
    }

    static async checkHash(password: string, hashPassword: string){
        return await compare(password, hashPassword);
    }

}