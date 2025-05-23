import { Response } from 'express';
import axios from 'axios';

import { setQrcode, setWhatsappReady } from '../../routes/admin';
import serverSendingPattern from '../../controllers/serverSendingPattern';

export default async function checkStatusWhatsappService(res: Response){

    const axiosClient = axios.create({
        baseURL: 'http://localhost:4000'
    });
    
    let retorno

    try{
        retorno = await axiosClient.get('/status');
        retorno = retorno.data;
        axiosClient.get('/start');
    }
    catch(error){
        retorno = null;
        console.log('Deu erro - '+error);
        serverSendingPattern(res, null, 'Erro, favor solicitar ajuda do suporte', null, null)
        return;
    }

    if(retorno == 'Não iniciado'){
        setWhatsappReady(false);
        setQrcode('');
        serverSendingPattern(res, null, null, null, null);
    }
    else{
        setWhatsappReady(true);
        setQrcode('');
        serverSendingPattern(res, null, null, 'Whatsapp conectado', null);
    }
    return;
}