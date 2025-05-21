const sendMailMock = jest.fn().mockResolvedValue('ok');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: sendMailMock
    }))
}));

let token = 'fklaejdroiuq23iopu2iPU@IOÇ$jlçkgjklfklaejdroiuq23iopu2iPU@IOÇ$jlçkgjklfklaejdroiuq23iopu2iPU@IOÇ$jlçkgjklfklaejdroiuq23iopu2iPU@';
let adminToken = 'fklçadjsfklçajsdfklu1o2ipu2iop3!@#14o1i2u4p1u289@&#*!(ifklçadjsfklçajsdfklu1o2ipu2iop3!@#14o1i2u4p1u289@&#*!fadsfjil2çj34l1142af';

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
        await prismaClient.systemConfig.create({
            data: { id: 1, nameStore: 'Loja X', fileSoon: 'teste', statusSystem: 2, creationDate: new Date() }
        });

        await prismaClient.user.create({
            data: { name: 'Teste', email: 'teste@exemplo.com', password: '123', phone: '3184135471', emailConfirmationToken: '456', emailConfirmationTokenExpirationDate: new Date() }
        })
        
        await prismaClient.user.create({
            data: { email: 'admin@email.com', password: 'deusefiel', name: 'admin', phone: '3185642175', status: 'OK', role: 'ADMIN' } 
        })

        setStatus(2);
    });

    it('test: route "/instalacao/config"', async () => {
        const res = await request(teste)
            .post('/instalacao/config');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ 'error': 'not found' });
    });

    it('test: route "/instalacao/admin"', async () => {
        const res = await request(teste)
            .post('/instalacao/admin');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ 'error': 'not found' });
    });

    it('test: route "/confirmacao"', async () => {
        const res = await request(teste)
            .get('/confirmacao');

        expect(res.status).toBe(200);
    });

    it('test: route "/confirmacao/:hash", with invalid hash', async () => {
        const res = await request(teste)
            .get('/confirmacao/123');
        
        expect(res.status).toBe(400);
        expect(res.body).toEqual({'error': 'Token inválido'});
    });

    it('test: route "/confirmacao/:hash", with valid hash (expired)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30)
        
        await prismaClient.user.update({
            where: { email: 'teste@exemplo.com' },
            data: { emailConfirmationTokenExpirationDate: data }
        }) 

        const res = await request(teste)
            .get('/confirmacao/456');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Token expirado' });
    });
    
    it('test: route "/confirmacao/:hash", with valid hash (all good)', async () => {
        let data = new Date();
        data.setDate(data.getDate()+30)

        await prismaClient.user.update({
            where: { email: 'teste@exemplo.com' },
            data: { emailConfirmationToken: '456', emailConfirmationTokenExpirationDate: data }
        }) 
        
        const res = await request(teste)
            .get('/confirmacao/456');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ 'ok': 'Email válidado'} );
    });
    
    it('test: route "/confirmacao/:hash", with a valid hash in the email already valid', async () => {
        let data = new Date();
        data.setDate(data.getDate()+30)

        await prismaClient.user.update({
            where: { email: 'teste@exemplo.com' },
            data: { emailConfirmationToken: '456', emailConfirmationTokenExpirationDate: data }
        }) 

        const res = await request(teste)
            .get('/confirmacao/456');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Email já validado' });
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

        const user = await prismaClient.user.findMany();

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
        }) 

        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com')
            .field('password', '123456789');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ 'ok': 'Login realizado' });
    })

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
    
    it('test: route "/login", accessing the route while logged in (with expired token expiration date)', async () => {
        const res = await request(teste)
            .post('/login')
            .set('Cookie', `token=${token}`)

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'error': 'Falta o email' });
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


    it('test: route "/login", accessing the route while logged in (with unexpired token)', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Cookie', `token=${token}`)

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/' });
    });

    it('test: route "/admin", accessing the route while logged in normal user', async() => {
        const res = await request(teste)
            .get('/admin/users')
            .set('Cookie', `token=${token}`)

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/' });
    });
    
    it('test: route "/admin", accessing the route while logged in admin user', async() => {
        let data = new Date();
        data.setDate(data.getDate()+30);

        await prismaClient.user.update({
            data: { loginToken: adminToken, loginTokenExpirationDate: data },
            where: { email: 'admin@email.com' }
        })

        const res = await request(teste)
            .get('/admin/users')
            .set('Cookie', `token=${adminToken}`);

        expect(res.status).toBe(200);
    });
    
    it('test: route "/admin", accessing with expired token (normal user)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30);

        await prismaClient.user.update({
            data: { loginTokenExpirationDate: data },
            where: { email: 'teste@email.com' }
        })

        const res = await request(teste)
            .get('/admin/users')
            .set('Cookie', `token=${token}`);

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/login' });
    });

    it('test: route "/admin", accessing with expired token (admin user)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30);

        await prismaClient.user.update({
            data: { loginTokenExpirationDate: data },
            where: { email: 'admin@email.com' }
        })

        const res = await request(teste)
            .get('/admin/users')
            .set('Cookie', `token=${adminToken}`);

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/login' });
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