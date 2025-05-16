import { Response } from 'express';
import axios from 'axios';

import generationWhatsappQrcodeService from './generationWhatsappQrcodeService';
import DatabaseManager from '../databaseManagerService';
import { setQrcode, setWhatsappReady } from '../../routes/admin';

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
        res.status(400).json({ 'error': 'Erro, favor solicitar ajuda do suporte' });
        return;
    }

    let html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exemplo SSE</title>
</head>
<body>
  <h1>QR Code</h1>
  <img id="imagem" alt="Seu whatsapp está conectado"></img>

  <script>
    console.log('rodando')
    // Criando a conexão com o servidor SSE
    const eventSource = new EventSource('http://localhost:3000/admin/whatsapp/qr');

    // Ouvindo as mensagens do servidor
    eventSource.onmessage = function(event) {
      console.log(event.data)
      if(event.data == '"Pronto"'){
        eventSource.close();
        document.getElementById('imagem').src = "";
        alert('zap zap conectado');
        return;
      }
        const imageBase64 = JSON.parse(event.data);
        document.getElementById('imagem').src = imageBase64;
        console.log('imagem gerada abaixo');
        console.log(imageBase64.dataUrl)
    };

    // Tratando possíveis erros
    eventSource.onerror = function(error) {
      console.log("Erro SSE:", error);
      eventSource.close();
    };
  </script>
</body>
</html>`

    if(retorno == 'Não iniciado'){
        setWhatsappReady(false)
        setQrcode('')
        res.send(html);
    }
    else{
        setWhatsappReady(true)
        setQrcode('')
        res.status(200).json({ 'ok': 'Whatsapp conectado' });
    }
    return;
}