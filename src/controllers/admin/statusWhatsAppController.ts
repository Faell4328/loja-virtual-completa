import { Request, Response } from 'express';
import axios from 'axios';
import { EventSource } from 'eventsource';

import generationWhatsappQrcodeService from '../../services/whatsapp/generationWhatsappQrcodeService';

export default async function statusWhatsAppController(req: Request, res: Response, sse: any){

    const axiosClient = axios.create({
        baseURL: 'http://localhost:4000'
    });
    
    let retorno

    try{
        retorno = await axiosClient.get('/status');
        retorno = retorno.data;
        console.log(`Status consultado: ${retorno}`);
    }
    catch(error){
        retorno = null;
        console.log('Deu erro - '+error);
        return;
    }

    if(retorno == 'Não iniciado'){
        const es = new EventSource('http://localhost:4000/start');
        es.onmessage = (event: MessageEvent) => {
            console.log('mensagem recebido')
            console.log(event.data);
            if(event.data == '"Pronto"'){
                console.log('Finalizado')
                const qrcode = JSON.parse(event.data)
                sse.send(qrcode);
                sse.close();
            }
            const qrcode = JSON.parse(event.data)
            sse.send(qrcode);
        }
    }
    else{
        console.log('ok')
    }
    return;
}