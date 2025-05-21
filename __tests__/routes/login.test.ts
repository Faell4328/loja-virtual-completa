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
        ])
    });

    beforeAll(async () => {
        await Promise.all([
            prismaClient.address.deleteMany(),
            prismaClient.user.deleteMany(),
            prismaClient.systemConfig.deleteMany()
        ]);

        await prismaClient.systemConfig.create({
            data: { id: 1, nameStore: 'Loja X', fileSoon: 'teste', statusSystem: 2, creationDate: new Date() }
        });

        await prismaClient.user.create({
            data: { name: 'Teste', email: 'teste@exemplo.com', password: '123', phone: '3184135471' }
        });
        
        setStatus(2);
    });
    it('creating a user', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('phone', '3154786410')
            .field('password', '123456789');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ 'ok': 'Usuário cadastrado' });
    });

    it('test: route "/login", no body', async () => {
        await prismaClient.user.update({
            where: { email: 'teste@email.com' },
            data: { loginToken: null, loginTokenExpirationDate: null }
        }) 

        const res = await request(teste)
            .post('/login')

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta o email'});
    });

    it('test: route "/login", send only the email (empty value)', async () => {
        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', '');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta o email' });
    });

    it('test: route "/login", send only the email', async () => {
        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta a senha' });
    });

    it('test: route "/login", send email and password (not existing)', async () => {
        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'testeteste@email.com')
            .field('password', '123456789');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Email ou senha incorreto' });
    });

    it('test: route "/login", send email and password (not existing)', async () => {

        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'testeteste@email.com')
            .field('password', '0000000000000');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Email ou senha incorreto' });
    });

    it('test: route "/login", with account without email confirmation (the account exists)', async () => {
        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com')
            .field('password', '123456789');

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/confirmacao' });
    });

    it('test: route "/login", with corret email and wrong password', async () => {

        await prismaClient.user.update({
            where: { email: 'teste@email.com' },
            data: { emailConfirmationToken: null, emailConfirmationTokenExpirationDate: null, status: 'OK' }
        });

        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com')
            .field('password', '123456789');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ 'ok': 'Login realizado' });
    })

    it('test: route "/login", accessing the route while logged in (with expired token expiration date)', async () => {
        let date = new Date();
        date.setDate(date.getDay()-30);

        await prismaClient.user.update({
            where: { email: 'teste@email.com' },
            data: { loginToken: token, loginTokenExpirationDate: date }
        });

        const res = await request(teste)
            .post('/login')
            .set('Cookie', `token=${token}`)

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta o email' });
    });

    it('test: route "/login", accessing the route while logged in (with unexpired token)', async () => {
        let date = new Date();
        date.setDate(date.getDay()+30);

        await prismaClient.user.update({
            where: { email: 'teste@email.com' },
            data: { loginTokenExpirationDate: date }
        });

        const res = await request(teste)
            .post('/cadastrar')
            .set('Cookie', `token=${token}`)

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/' });
    });
});