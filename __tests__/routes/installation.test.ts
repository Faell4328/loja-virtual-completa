
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

import { teste } from '../../src/teste';
import request from 'supertest';
import { resolve } from 'path';
import prismaClient from '../../src/prisma';

describe('installation.ts file route test', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    beforeAll(async () => {
        await Promise.all([
            prismaClient.address.deleteMany(),
            prismaClient.user.deleteMany(),
            prismaClient.systemConfig.deleteMany()
        ])
    });

    afterAll(async () => {
        await Promise.all([
            prismaClient.address.deleteMany(),
            prismaClient.user.deleteMany(),
            prismaClient.systemConfig.deleteMany()
        ])
    });

    it('test: route "/", no body', async () => {
        const res = await request(teste)
            .get('/');

        expect(res.body).toEqual(serverSendingPattern('/instalacao/config', null, null, null));
    });

    it('test: route "/", with form data', async () => {
        const res = await request(teste)
            .post('/')
            .set('Content-Type', 'multipart/form-data')

        expect(res.body).toEqual(serverSendingPattern('/instalacao/config', null, null, null));
    })

    it('test: route "/instalacao/config", no body', async () => {
        const res = await request(teste)
            .post('/instalacao/config');

        expect(res.body).toEqual(serverSendingPattern(null, 'Falta o nome', null, null));
    });

    it('test: route "/instalacao/config", with form data (name only)', async () => {
        const res = await request(teste)
            .post('/instalacao/config')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'teste');

        expect(res.body).toEqual(serverSendingPattern(null, 'Falta o arquivo', null, null));
    });

    it('test: route "/instalacao/config", with form data (file only)', async () => {
        const file = resolve(__dirname, '..', 'files', 'routerTestFile.jpeg');

        const res = await request(teste)
            .post('/instalacao/config')
            .set('Content-Type', 'multipart/form-data')
            .attach('file', file);

        expect(res.body).toEqual(serverSendingPattern(null, 'Falta o nome', null, null));
    });

    it('test: route "/instalacao/admin", without configuring the server', async () => {
        const res = await request(teste)
            .post('/instalacao/admin');

        expect(res.body).toEqual(serverSendingPattern('/instalacao/config', 'Faça a configuração do sistema primeiro', null, null));
    });

    it('test: route "instalacao/config", with form data (full)', async () => {
        const file = resolve(__dirname, '..', 'files', 'routerTestFile.jpeg');

        const res = await request(teste)
            .post('/instalacao/config')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'teste')
            .attach('file', file);

        expect(res.body).toEqual(serverSendingPattern('/instalacao/admin', null, 'Sistema configurado com sucesso', null));
    });

    it('test: route "/", checking after configuring the server, it will return the correct route', async () => {
        const res = await request(teste)
            .post('/');

        expect(res.body).toEqual(serverSendingPattern('/instalacao/admin', null, null, null));
    });

    it('test: route "/instalacao/admin", with configured server (no body)', async () => {
        const res = await request(teste)
            .post('/instalacao/admin');

        expect(res.body).toEqual(serverSendingPattern(null, 'Falta o nome', null, null));
    });

    it('test: route "/instalacao/admin", with configured server (email only)', async () => {
        const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('email', 'teste@hotmail.com');

        expect(res.body).toEqual(serverSendingPattern(null, 'Falta o nome', null, null));
    });

    it('test: route "/instalacao/admin", with configured server (name only)', async () => {
        const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell');

        expect(res.body).toEqual(serverSendingPattern(null, 'Falta o email', null, null));
    });

    
    it('test: route "/instalacao/admin", with configured server (with error name)', async () => {
        const res = await request(teste)
        .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'a')
            .field('email', 'teste@exemplo.com')
            .field('password', '123');

        expect(res.body).toEqual(serverSendingPattern(null, 'Nome precisa ter no mínimo 2 caracteres', null, null));
    });

    it('test: route "/instalacao/admin", with configured server (with error email 1)', async () => {
        const res = await request(teste)
        .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@exemplo')
            .field('password', '123');

        expect(res.body).toEqual(serverSendingPattern(null, 'Email inválido', null, null));
    });

    it('test: route "/instalacao/admin", with configured server (with error email 2)', async () => {
        const res = await request(teste)
        .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'testeexemplo.com')
            .field('password', '123');

        expect(res.body).toEqual(serverSendingPattern(null, 'Email inválido', null, null));
        });
        
        it('test: route "/instalacao/admin", with configured server (with error password)', async () => {
            const res = await request(teste)
            .post('/instalacao/admin')
            .set('Content-Type', 'multipart/form-data')
            .field('name', 'Faell')
            .field('email', 'teste@exemplo.com')
            .field('phone', '1187453201')
            .field('password', '123');
            
        expect(res.body).toEqual(serverSendingPattern(null, 'A senha deve ter no mínimo 8 caracteres', null, null));
        });

        it('test: router "/instalacao/admin", with configured server', async () => {
            const res = await request(teste)
                .post('/instalacao/admin')
                .set('Content-Type', 'multipart/form-data')
                .field('name', 'Faell')
                .field('email', 'teste@exemplo.com')
                .field('phone', '3184756410')
                .field('password', '123456789');
    
        expect(res.body).toEqual(serverSendingPattern('/confirmacao', null, 'Usuário administrador criado', null));
        });
})