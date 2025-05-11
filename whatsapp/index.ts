import express, { Request, Response } from 'express';
import axios from 'axios';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import QRCode from 'qrcode';

const axiosClient = axios.create({
    baseURL: 'http://192.168.100.72:3000'
})

const app = express();
app.use(express.json())

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'zap-service' }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let qrcode = '';
client.on('qr', async (qr: string) => {
    const dataUrl = await QRCode.toDataURL(qr);
    qrcode = dataUrl;
    console.log('qr gerado')
    try{
        axiosClient.post('/webhook/whatsapp', {
            data: dataUrl,
            token: '123'
        })
        .catch(error => {
            console.log('Erro eo enviar o QRCode');
        })
    }
    catch(erro){
        console.log('Erro eo enviar o QRCode')
    }
});

let isReady = false;
client.on('ready', () => {
    isReady = true;
    console.log('WhatsApp pronto');
    try{
        axiosClient.post('/webhook/whatsapp', {
            data: 'Pronto',
            token: '123'
        })
        .catch(error => {
            console.log('Erro eo enviar o QRCode');
        })
    }
    catch(error){
        console.log('Erro ao enviar o QRCode');
    }
});

client.on('disconnected', async () => {
    console.log('WhatsApp desconectado')
    isReady = false;
    alreadyRequested = false;
    await client.destroy();
    try{
        axiosClient.post('/webhook/whatsapp', {
            data: 'Pronto',
            token: '123'
        })
        .catch(error => {
            console.log('Erro eo enviar a solicitação para desconectar');
        })
    }
    catch(error){
        console.log('Erro ao enviar a solicitação para desconectar');
    }
})

app.get('/status', (req: Request, res: Response) => {
    console.log('status consultado')
    if(isReady){
        res.send('Pronto')
    }
    else{
        res.send('Não iniciado')
    }
    return;
});

async function timeout(){
    setTimeout( () => {
        if(isReady == false){
            client.destroy();
            console.log('Instância finalizada');
            alreadyRequested = false;
            try{
                axiosClient.post('/webhook/whatsapp', {
                data: '',
                token: '123'
                })
                .catch(error => {
                    console.log('Erro eo enviar o timeout');
                })
            }
            catch(error){
                console.log('Erro ao enviar o timeout');
            }
        }
    }, 200000);
}

let alreadyRequested = false;
app.get('/start', async (req: Request, res: Response) => {
    console.log('solicitado o start')
    if(isReady){
        console.log('já iniciado')
        res.send('Já iniciado');
        return;
    }
    else if(alreadyRequested){
        console.log('já startado')
        res.send('Já solicitado');
        return;
    }
    alreadyRequested = true;
    console.log('iniciado')
    await client.initialize();
    timeout();
    return;
});

app.post('/send', (req: Request, res: Response) => {
    const { to, text } = req.body;
    const jid = to.endsWith('@c.us') ? to : `${to}@c.us`;
    console.log(jid);
    client.sendMessage(jid, text)
    .catch(err => console.error('Erro ao enviar a mensagem:', err));
    res.sendStatus(200);
    return;
});


app.listen(4000, () => {
    console.log('Rodando em http://localhost:4000');
});
