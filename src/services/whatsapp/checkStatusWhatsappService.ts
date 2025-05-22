import { response, Response } from 'express';
import axios from 'axios';

import generationWhatsappQrcodeService from './generationWhatsappQrcodeService';
import DatabaseManager from '../databaseManagerService';
import { setQrcode, setWhatsappReady } from '../../routes/admin';
import sendResponse from '../../controllers/controllerSendPattern';

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
        sendResponse(res, null, 'Erro, favor solicitar ajuda do suporte', null, null)
        return;
    }

    if(retorno == 'Não iniciado'){
        setWhatsappReady(false);
        setQrcode('');
        res.set([

        ])
        sendResponse(res, null, null, null, null);
    }
    else{
        setWhatsappReady(true);
        setQrcode('');
        sendResponse(res, null, null, 'Whatsapp conectado', null);
    }
    return;
}