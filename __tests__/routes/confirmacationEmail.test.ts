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
        })
        
        await prismaClient.user.create({
            data: { email: 'admin@email.com', password: 'deusefiel', name: 'admin', phone: '3185642175', status: 'OK', role: 'ADMIN' } 
        });

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
});