const sendMailMock = jest.fn().mockResolvedValue('ok');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: sendMailMock
    }))
}));

jest.mock('express-rate-limit', () => {
    return () => {
        return (req: any, res: any, next: any) => next();
    }
})

function serverSendingPattern(redirect: string | null, error: string | null, ok: string | null, data: string | null){
    return{
        redirect,
        error,
        ok,
        data
    }
}

let token = 'fklaejdroiuq23iopu2iPU@IOÇ$jlçkgjklfklaejdroiuq23iopu2iPU@IOÇ$jlçkgjklfklaejdroiuq23iopu2iPU@IOÇ$jlçkgjklfklaejdroiuq23iopu2iPU@';

import { teste } from '../../src/teste';
import request from 'supertest';
import prismaClient from '../../src/prisma';
import { setStatus } from '../../src/tools/status';

describe('router.ts file route test', () => {
    afterAll(async () => {
        await Promise.all([
            prismaClient.address.deleteMany(),
            prismaClient.user.deleteMany(),
            prismaClient.systemConfig.deleteMany()
        ]);
    });

    beforeAll(async () => {
        await Promise.all([
            prismaClient.address.deleteMany(),
            prismaClient.user.deleteMany(),
            prismaClient.systemConfig.deleteMany()
        ]);

        Promise.all([
            await prismaClient.systemConfig.create({
                data: { id: 1, nameStore: 'Loja X', fileSoon: 'teste', statusSystem: 2, creationDate: new Date() }
            }),

            await prismaClient.user.create({
                data: { name: 'Teste', email: 'teste@exemplo.com', password: '123', phone: '3184135471', emailConfirmationToken: '456', emailConfirmationTokenExpirationDate: new Date() }
            })
        ]);
        
        setStatus(2);
    });

    it('test: route "/cadastrar", no body', async () => {

        const res = await request(teste)
            .post('/cadastrar')

        serverSendingPattern(null, 'Falta o nome', null, null);
    });

    it('test: route "/cadastrar", send only the name (empty value)', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', '');

        serverSendingPattern(null, 'Falta o nome', null, null);
    });

    it('test: route "/cadastrar", send only the name', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell');

        serverSendingPattern(null, 'Falta o email', null, null);
    });
    
    it('test: route "/cadastrar", send the name and email', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com');

        serverSendingPattern(null, 'Falta o telefone', null, null)
    });
    it('test: route "/cadastrar", send the name, email and phone', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('phone', '3154786410');

        serverSendingPattern(null, 'Falta a senha', null, null);
    });


    it('test: route "/cadastrar", send the email exists', async () => {

        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@exemplo.com')
            .field('phone', '3154786410')
            .field('password', '123456789');

        serverSendingPattern(null, 'Email já existe', null, null);
    });


    it('test: route "/cadastrar", all good', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('phone', '3154786410')
            .field('password', '123456789');

        serverSendingPattern('/', null, 'Usuário cadastrado', null);
    });


    it('test: route "/cadastrar", accessing the route while logged in (with expired token expiration date)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30);

        await prismaClient.user.update({
            where: { email: 'teste@email.com' },
            data: { loginToken: token, loginTokenExpirationDate: data}
        }) 

        const res = await request(teste)
            .post('/cadastrar')
            .set('Cookie', `token=${token}`)

        serverSendingPattern('/', 'Falta o nome', null, null);
    });

    it('test: route "/cadastrar", accessing the route while logged in (with unexpired token)', async () => {
        let data = new Date();
        data.setDate(data.getDate()+30);

        await prismaClient.user.update({
            where: { email: 'teste@email.com' },
            data: { loginToken: token, loginTokenExpirationDate: data}
        }) 

        const res = await request(teste)
            .post('/cadastrar')
            .set('Cookie', `token=${token}`)

        serverSendingPattern('/', null, null, null);
    });

    it('test: route "/cadastrar", with invalid name', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'a');

        serverSendingPattern(null, 'Nome precisa ter no mínimo 2 caracteres', null, null);
    });

    it('test: route "/cadastrar", with invalid email - part 1', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'testeafd@email');

        serverSendingPattern(null, 'Email inválido', null, null);
    });

    it('test: route "/cadastrar", with invalid email - part 2', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'testeemail.com');

        serverSendingPattern(null, 'Email inválido', null, null);
    });

    it('test: route "/cadastrar", with invalid phone', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('phone', '31874523')

        serverSendingPattern(null, 'Seu número de telefone deve ter 10 caracteres', null, null);
    })

    it('test: route "/cadastrar", with weak password', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('phone', '3187454123')
            .field('password', '13');

        serverSendingPattern(null, 'A senha deve ter no mínimo 8 caracteres', null, null);
    });
});