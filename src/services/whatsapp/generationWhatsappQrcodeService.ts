import { Response } from 'express';
import eventBus from '../../server';
import { whatsappReady } from '../../routes/admin';

export default async function generationWhatsappQrcodeService(sse: any, res: Response, qrcode: string){

    if(qrcode != ''){
        sse.send(qrcode);
    }

    eventBus.on('qrcode_update', (qrcode) => {
        if(whatsappReady == true){
            sse.send('Pronto')
        }
        sse.send(qrcode);
    });
} 