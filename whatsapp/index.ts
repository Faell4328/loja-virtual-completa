import express, { Request, Response } from 'express';
import axios from 'axios';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import QRCode from 'qrcode';

const axiosClient = axios.create({
    baseURL: 'http://192.168.100.72:3000'
})

const app = express();
app.use(express.json())

let timeoutWhatsapp: NodeJS.Timeout;
let qrcode = '';
let alreadyRequested = false;
let isReady = false;

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'zap-service' }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', async (qr: string) => {
    const dataUrl = await QRCode.toDataURL(qr);
    qrcode = dataUrl;
    console.log('qr gerado')
    try{
        axiosClient.post('/webhook/whatsapp', {
            data: dataUrl,
            token: process.env.TOKEN_WEB_HOOK
        })
        .catch(error => {
            console.log('Erro ao enviar o QRCode - 1');
        })
    }
    catch(erro){
        console.log('Erro ao enviar o QRCode - 2')
    }
});

client.on('ready', () => {
    isReady = true;
    console.log('WhatsApp pronto');
    clearTimeout(timeoutWhatsapp);
    try{
        axiosClient.post('/webhook/whatsapp', {
            data: 'Pronto',
            token: process.env.TOKEN_WEB_HOOK
        })
        .catch(error => {
            console.log('Erro ao enviar a solicitação de finalização');
        })
    }
    catch(error){
        console.log('Erro ao enviar a solicitação de finalização');
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
            token: process.env.TOKEN_WEB_HOOK
        })
        .catch(error => {
            console.log('Erro ao enviar a solicitação para desconectar');
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
    timeoutWhatsapp = setTimeout( () => {
        if(isReady == false){
            client.destroy();
            console.log('Instância finalizada');
            alreadyRequested = false;
            try{
                axiosClient.post('/webhook/whatsapp', {
                data: '',
                token: process.env.TOKEN_WEB_HOOK
                })
                .catch(error => {
                    console.log('Erro ao enviar o timeout');
                })
            }
            catch(error){
                console.log('Erro ao enviar o timeout');
            }
        }
    }, 200000);
}

app.get('/start', async (req: Request, res: Response) => {
    console.log('solicitado o start')
    if(isReady){
        console.log('já iniciado')
        res.send('Já iniciado');
        return;
    }
    else if(alreadyRequested){
        console.log('já startado')
        try{
            axiosClient.post('/webhook/whatsapp', {
                data: qrcode,
                token: process.env.TOKEN_WEB_HOOK
            })
            .catch(error => {
                console.log('Erro ao enviar o QRCode - 1');
            })
        }
        catch(erro){
            console.log('Erro ao enviar o QRCode - 2')
        }
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
    try{
        client.sendMessage(jid, text)
        .catch(err => console.error('Erro ao enviar a mensagem:', err));
    }
    catch(error){
        console.error('Erro ao enviar a mensagem:', error);
    }
    res.sendStatus(200);
    return;
});


alreadyRequested = true;
console.log('iniciado')
client.initialize();
timeout();


app.listen(4000, () => {
    console.log('Rodando em http://localhost:4000');
});
