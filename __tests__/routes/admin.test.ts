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

        let date = new Date();
        date.setDate(date.getDate()+30)

        await prismaClient.systemConfig.create({
            data: { id: 1, nameStore: 'Loja X', fileSoon: 'teste', statusSystem: 2, creationDate: new Date() }
        });

        await prismaClient.user.create({
            data: { name: 'Teste', email: 'teste@exemplo.com', password: '123123123', phone: '3184135471', loginToken: token, loginTokenExpirationDate: date, status: 'OK' }
        })
        
        await prismaClient.user.create({
            data: { name: 'admin', email: 'admin@email.com', password: 'deusefiel', phone: '3185642175', loginToken: adminToken, loginTokenExpirationDate: date, status: 'OK', role: 'ADMIN' } 
        })

        setStatus(2);
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
            where: { email: 'teste@exemplo.com' }
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
});