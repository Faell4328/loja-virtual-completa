import { Router, Request, Response } from 'express';
import multer from 'multer';
import SSE from 'express-sse';

import uploadConfig from '../config/multer';
import isAdmin from '../middlewares/isAdmin';

import listUsersController from '../controllers/admin/listUsersController';
import listSpecificUserController from '../controllers/admin/listSpecificUserController';
import statusWhatsAppController from '../controllers/admin/statusWhatsAppController';

const routerAdmin = Router();

const upload = multer(uploadConfig.upload());

routerAdmin.get('/admin', isAdmin, (req: Request, res: Response) => {
    res.send('Você tem acesso a rota admin, é necessário estar logado como admin');
    return;
});

routerAdmin.get('/admin/users', isAdmin, (req: Request, res: Response) => {
    listUsersController(req, res);
    return;
});

routerAdmin.get('/admin/user/:id', isAdmin, (req: Request, res: Response) => {
    listSpecificUserController(req, res);
    return
})

routerAdmin.get('/admin/whatsapp', (req: Request, res: Response) => {
  res.write(`<!DOCTYPE html>
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
        document.getElementById('imagem').src = imageBase64.dataUrl;
        console.log(imageBase64.dataUrl)
    };

    // Tratando possíveis erros
    eventSource.onerror = function(error) {
      console.log("Erro SSE:", error);
      eventSource.close();
    };
  </script>
</body>
</html>`);
    return
});

routerAdmin.get('/admin/whatsapp/qr', (req: Request, res: Response) => {
  const sse = new SSE();
  sse.init(req, res);
  statusWhatsAppController(req, res, sse)
});

export { routerAdmin }