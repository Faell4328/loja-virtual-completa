import express, { Request, Response } from 'express';
import axios from 'axios';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import SSE from 'express-sse';

const axiosClient = axios.create({
  baseURL: 'http://192.168.100.72:3000'
})

const app = express();
const sse = new SSE();

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'zap-service' }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', async (qr: string) => {
  const dataUrl = await QRCode.toDataURL(qr);
  console.log('qr gerado')
  sse.send({ dataUrl });
});

let isReady = false;
client.on('ready', () => {
  isReady = true;
  console.log('WhatsApp pronto');
  sse.send('Pronto')
});

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

app.get('/start', async (req: Request, res: Response) => {
  sse.init(req, res);
  await client.initialize();
  return;
})

app.post('/send', (req: Request, res: Response) => {
  const { to, text } = req.body;
  const jid = to.endsWith('@c.us') ? to : `${to}@c.us`;
  client.sendMessage(jid, text)
    .catch(err => console.error('Erro ao enviar a mensagem:', err));
  res.sendStatus(200);
  return;
});


app.listen(4000, () => {
  console.log('Rodando em http://localhost:4000');
});
