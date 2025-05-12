import { Response } from 'express';
import eventBus from '../../server';

export default async function generationWhatsappQrcodeService(sse: any, res: Response, qrcode: string){

    if(qrcode != ''){
        sse.send(qrcode);
    }

    eventBus.on('qrcode_update', (qrcode) => {
        sse.send(qrcode);
    });
} 