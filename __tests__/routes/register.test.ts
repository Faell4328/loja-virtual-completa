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
        ]);
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
            data: { name: 'Teste', email: 'teste@exemplo.com', password: '123', phone: '3184135471', emailConfirmationToken: '456', emailConfirmationTokenExpirationDate: new Date() }
        });
        
        setStatus(2);
    });

    it('test: route "/cadastrar", no body', async () => {

        const res = await request(teste)
            .post('/cadastrar')

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta o nome'});
    });

    it('test: route "/cadastrar", send only the name (empty value)', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', '');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta o nome'});
    });

    it('test: route "/cadastrar", send only the name', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta o email'});
    });
    
    it('test: route "/cadastrar", send the name and email', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta o telefone'});
    });
    it('test: route "/cadastrar", send the name, email and phone', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('phone', '3154786410');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta a senha'});
    });


    it('test: route "/cadastrar", send the email exists', async () => {

        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@exemplo.com')
            .field('phone', '3154786410')
            .field('password', '123456789');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Email já existe'});
    });


    it('test: route "/cadastrar", all good', async () => {
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

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta o nome' });
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

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/' });
    });

    it('test: route "/cadastrar", with invalid name', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'a');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Nome precisa ter no mínimo 2 caracteres'});
    });

    it('test: route "/cadastrar", with invalid email - part 1', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'testeafd@email');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Email inválido'});
    });

    it('test: route "/cadastrar", with invalid email - part 2', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'testeemail.com');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Email inválido'});
    });

    it('test: route "/cadastrar", with invalid phone', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('phone', '31874523')

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Seu número de telefone deve ter 10 caracteres'});
    })

    it('test: route "/cadastrar", with weak password', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('phone', '3187454123')
            .field('password', '13');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'A senha deve ter no mínimo 8 caracteres'});
    });
});