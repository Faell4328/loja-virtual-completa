import request from 'supertest';
import { writeFileSync } from 'fs';
import { unlink, rm, mkdir } from 'fs/promises';
import { resolve } from 'path';

writeFileSync(resolve(__dirname, '..', '..', 'config.json'), JSON.stringify({ 'teste': 'teste' }));

const sendMailMock = jest.fn().mockResolvedValue('ok');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: sendMailMock
    }))
}));

jest.mock('../../src/prisma', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
            create: jest.fn()
        }
    }
}));

import prismaClient from '../../src/prisma/index';
import { teste } from '../../src/teste';

const prismaMock = prismaClient as any;

describe('installation.ts file route test', () => {
    afterAll(async () => {
        await unlink(resolve(__dirname, '..', '..', 'config.json'));

        const caminho = resolve(__dirname, '..', '..', 'public', 'files');

        await rm(caminho, { recursive: true, force: true });
        await mkdir(caminho, { recursive: true });
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


    it('test: route "/confirmacao", accessing the route while logged in (with expired token expiration date)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data });

        const res = await request(teste)
            .get('/confirmacao')
            .set('token', '123')

        expect(res.status).toBe(200);
        expect(res.text).toBe('Por favor, verifique o email que foi enviado para você com o link para ativação');
    });

    it('test: route "/confirmacao", accessing the route while logged in (with unexpired token)', async () => {
        let data = new Date();
        data.setDate(data.getDate()+30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data });

        const res = await request(teste)
            .get('/confirmacao')
            .set('token', '123')

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/' });
    });

    it('test: route "/confirmacao/:hash", with invalid hash', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        const res = await request(teste)
            .get('/confirmacao/123');
        
        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
    });

    it('test: route "/confirmacao/:hash", with valid hash (expired)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30)

        prismaMock.user.findUnique.mockResolvedValue({ email: 'teste@email.com', password: '123', emailConfirmationTokenExpirationDate: data , status: 'PENDING_VALIDATION_EMAIL' });
        prismaMock.user.update.mockResolvedValue({ ok: 'ok' });

        const res = await request(teste)
            .get('/confirmacao/456');

        expect(res.status).toBe(200);
        expect(res.text).toBe('Token expirado, foi enviado para seu email um novo token');
    });

    it('test: route "/confirmacao/:hash", with valid hash (already used and not expired)', async () => {
        let data = new Date();
        data.setDate(data.getDate()+30)

        prismaMock.user.findUnique.mockResolvedValue({ email: 'teste@email.com', password: '123', emailConfirmationTokenExpirationDate: data , status: 'OK' });

        const res = await request(teste)
            .get('/confirmacao/456');

        expect(res.status).toBe(200);
        expect(res.text).toBe('Email já validado');
    });

    it('test: route "/confirmacao/:hash", with valid hash (all good)', async () => {
        let data = new Date();
        data.setDate(data.getDate()+30)

        prismaMock.user.findUnique.mockResolvedValue({ email: 'teste@email.com', password: '123', emailConfirmationTokenExpirationDate: data , status: 'PENDING_VALIDATION_EMAIL' });

        const res = await request(teste)
            .get('/confirmacao/456');

        expect(res.status).toBe(200);
        expect(res.text).toBe('Email válidado');
    });

    it('test: route "/confirmacao/:hash", accessing the route while logged in (with expired token expiration date)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data });

        const res = await request(teste)
            .get('/confirmacao/456')
            .set('token', '123')

        expect(res.status).toBe(200);
        expect(res.text).toBe('Email já validado');
    });

    it('test: route "/confirmacao/:hash", accessing the route while logged in (with unexpired token)', async () => {
        let data = new Date();
        data.setDate(data.getDate()+30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data });

        const res = await request(teste)
            .get('/confirmacao/456')
            .set('token', '123')

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/' });
    });

    it('test: route "/cadastrar", no body', async () => {
        const res = await request(teste)
            .post('/cadastrar')

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Não foi enviado formulário'});
    });

    it('test: route "/cadastrar", send only the name (empty value)', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', '');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta o nome'});
    });

    it('test: route "/cadastrar", send only the name', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta o email'});
    });

    it('test: route "/cadastrar", send the name and email', async () => {
        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta a senha'});
    });

    it('test: route "/cadastrar", send the email exists', async () => {
        prismaMock.user.findUnique.mockResolvedValue({ 'email exists': true });

        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('password', '123');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Email já existe'});
    });


    it('test: route "/cadastrar", all good', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);
        prismaMock.user.create.mockResolvedValue({ 'create': 'ok' });
        prismaMock.user.update.mockResolvedValue({ 'create': 'ok' });

        const res = await request(teste)
            .post('/cadastrar')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@email.com')
            .field('password', '123');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ 'ok': 'Usuário cadastrado' });
    });

    it('test: route "/login", no body', async () => {
        const res = await request(teste)
            .post('/login')

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Não foi enviado formulário'});
    });

    it('test: route "/login", send only the email (empty value)', async () => {
        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', '');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta o email' });
    });

    it('test: route "/login", send only the email', async () => {
        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta a senha' });
    });

    it('test: route "/login", send email and password (not existing)', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com')
            .field('password', '123');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Email ou senha incorreto' });
    });

    it('test: route "/login", send email and password (not existing)', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com')
            .field('password', '123');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Email ou senha incorreto' });
    });

    it('test: route "/login", with account without email confirmation (the account exists)', async () => {
        prismaMock.user.findUnique.mockResolvedValue({ emailConfirmationToken: '456', password: '123' });

        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com')
            .field('password', '123');

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/confirmacao' });
    });

    it('test: route "/login", with corret email and wrong password', async () => {

        prismaMock.user.findUnique.mockResolvedValue({ emailConfirmationToken: null, password: '$2b$10$SjZQigUR.vjktzPwk86l6OYd3Wf/YRKS73LBZjfZu6Vldl.rNcyxS' });
        prismaMock.user.update.mockResolvedValue({ logado: 'true' });

        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com')
            .field('password', '123');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Email ou senha incorreto' });
    })

    it('test: route "/login", account with email confirmation (the account exists)', async () => {
        prismaMock.user.findUnique.mockResolvedValue({ emailConfirmationToken: null, password: '$2b$10$SjZQigUR.vjktzPwk86l6OYd3Wf/YRKS73LBZjfZu6Vldl.rNcyxS' });
        prismaMock.user.update.mockResolvedValue({ logado: 'true' });

        const res = await request(teste)
            .post('/login')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@email.com')
            .field('password', '123456789');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ 'ok': 'Login realizado' });
    });

    it('test: route "/cadastrar", accessing the route while logged in (with expired token expiration date)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data });

        const res = await request(teste)
            .post('/cadastrar')
            .set('token', '123')

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Não foi enviado formulário' });
    });

    it('test: route "/cadastrar", accessing the route while logged in (with unexpired token)', async () => {
        let data = new Date();
        data.setDate(data.getDate()+30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data });

        const res = await request(teste)
            .post('/cadastrar')
            .set('token', '123')

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/' });
    });

    it('test: route "/login", accessing the route while logged in (with expired token expiration date)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data });

        const res = await request(teste)
            .post('/login')
            .set('token', '123');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Não foi enviado formulário' });
    });

    it('test: route "/login", accessing the route while logged in (with unexpired token)', async () => {
        let data = new Date();
        data.setDate(data.getDate()+30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data });

        const res = await request(teste)
            .post('/login')
            .set('token', '123');

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/' });
    });

    it('test: route "/admin", accessing the route while logged in normal user', async() => {
        let data = new Date();
        data.setDate(data.getDate()+30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data, role: 'USER' });

        const res = await request(teste)
            .post('/admin')
            .set('token', 'normal user');

        expect(res.status).toBe(200);
        expect(res.text).toBe('Você não tem permissão');
    });
    
    it('test: route "/admin", accessing the route while logged in admin user', async() => {
        let data = new Date();
        data.setDate(data.getDate()+30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data, role: 'ADMIN' });

        const res = await request(teste)
            .post('/admin')
            .set('token', 'admin user');

        expect(res.status).toBe(200);
        expect(res.text).toBe('Liberado');
    });
    
    it('test: route "/admin", accessing with expired token (normal user)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data, role: 'USER' });

        const res = await request(teste)
            .post('/admin')
            .set('token', 'normal user');

        expect(res.status).toBe(200);
        expect(res.text).toBe('Token vencido, faça login');
    });

    it('test: route "/admin", accessing with expired token (admin user)', async () => {
        let data = new Date();
        data.setDate(data.getDate()-30);

        prismaMock.user.findUnique.mockResolvedValue({ loginTokenExpirationDate: data, role: 'ADMIN' });

        const res = await request(teste)
            .post('/admin')
            .set('token', 'admin user');

        expect(res.status).toBe(200);
        expect(res.text).toBe('Token vencido, faça login');
    });
});