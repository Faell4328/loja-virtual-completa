import request from 'supertest';
import { unlink, rm, mkdir } from 'fs/promises';
import { resolve } from 'path';

const sendMailMock = jest.fn().mockResolvedValue('ok');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: sendMailMock
    }))
}));


jest.mock('../../src/prisma', () => ({
    __esModule: true,
    default: {
        systemConfig: {
            create: jest.fn()
        },
        user: {
            create: jest.fn(),
            update: jest.fn()
        }
    }
}));

import prismaClient from '../../src/prisma/index';
import { teste } from '../../src/teste';

const prismaMock = prismaClient as any;

describe('installation.ts file route test', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    afterAll(async () => {
        await unlink(resolve(__dirname, '..', '..', 'config.json'));

        const caminho = resolve(__dirname, '..', '..', 'public', 'files');

        await rm(caminho, { recursive: true, force: true });
        await mkdir(caminho, { recursive: true });
    })

    it('test: route "/", no body', async () => {
        const res = await request(teste)
            .post('/');

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/instalacao/config' });
    });

    it('test: route "/", with form data', async () => {
        const res = await request(teste)
            .post('/')
            .set('Content-Type', 'multipart/form-data')

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/instalacao/config' });
    })

    it('test: route "/instalacao/config", no body', async () => {
        const res = await request(teste)
            .post('/instalacao/config');

            expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta o nome' });
    });

    it('test: route "/instalacao/config", with form data (name only)', async () => {
        const res = await request(teste)
            .post('/instalacao/config')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'teste');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta o arquivo' });
    });

    it('test: route "/instalacao/config", with form data (file only)', async () => {
        const file = resolve(__dirname, '..', 'files', 'routerTestFile.jpeg');

        const res = await request(teste)
            .post('/instalacao/config')
            .set('Content-Type', 'multipart/form-data')
            .attach('file', file);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta o nome' });
    });

    it('test: route "/instalacao/admin", without configuring the server', async () => {
        const res = await request(teste)
            .post('/instalacao/admin');

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/instalacao/config' });
    });

    it('test: route /instalacao/config", with form data (full)', async () => {
        prismaMock.systemConfig.create.mockResolvedValue({ok: 'ok'});

        const file = resolve(__dirname, '..', 'files', 'routerTestFile.jpeg');

        const res = await request(teste)
            .post('/instalacao/config')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'teste')
            .attach('file', file);

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/instalacao/admin' });
    });

    it('test: route "/", checking after configuring the server, it will return the correct route', async () => {
        const res = await request(teste)
            .post('/');

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/instalacao/admin' });
    });

    it('test: route "/instalacao/admin", with configured server (no body)', async () => {
        const res = await request(teste)
            .post('/instalacao/admin');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta o nome' });
    });

    it('test: route "/instalacao/admin", with configured server (email only)', async () => {
        const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@hotmail.com');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta o nome'});
    });

    it('test: route "/instalacao/admin", with configured server (name only)', async () => {
        const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Falta o email'});
    });

    it('test: router "/instalacao/admin", with configured server', async () => {
        prismaMock.user.create.mockResolvedValue({ok: 'ok'});
        prismaMock.user.update.mockResolvedValue({ok: 'ok'});

        const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@exemplo.com')
            .field('password', '123456789');

        expect(res.status).toBe(307);
        expect(res.body).toEqual({ 'redirect': '/confirmacao'});
    });


    // Test input

    it('test: route "/instalacao/admin", with configured server (with error name)', async () => {
        prismaMock.user.create.mockResolvedValue({ok: 'ok'});
        prismaMock.user.update.mockResolvedValue({ok: 'ok'});


        const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'a')
            .field('email', 'teste@exemplo.com')
            .field('password', '123');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Nome precisa ter mais que 2 caracteres'});
    });

    it('test: route "/instalacao/admin", with configured server (with error email 1)', async () => {
        prismaMock.user.create.mockResolvedValue({ok: 'ok'});
        prismaMock.user.update.mockResolvedValue({ok: 'ok'});

        const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@exemplo')
            .field('password', '123');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Email invalido'});
    });

    it('test: route "/instalacao/admin", with configured server (with error email 2)', async () => {
        prismaMock.user.create.mockResolvedValue({ok: 'ok'});
        prismaMock.user.update.mockResolvedValue({ok: 'ok'});

        const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'testeexemplo.com')
            .field('password', '123');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'Email invalido'});
    });

    it('test: route "/instalacao/admin", with configured server (with error password)', async () => {
        prismaMock.user.create.mockResolvedValue({ok: 'ok'});
        prismaMock.user.update.mockResolvedValue({ok: 'ok'});

        const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@exemplo.com')
            .field('password', '123');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ 'erro': 'A senha deve ter no mínimo 8 caracteres'});
    });
})