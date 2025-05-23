import { Request, Response, NextFunction } from "express";
import serverSendingPattern from "../controllers/serverSendingPattern";

export default function errorHandling(err: any, req: Request, res: Response, next: NextFunction){
    if(err.code == 'LIMIT_UNEXPECTED_FILE'){
        serverSendingPattern(res, null, 'Você enviou imagem onde não devia ou enviou mais do que devia', null, null);
        return;
    }
    else if(err.code == 'INVALID_FILE_EXTENSION'){
        serverSendingPattern(res, null, 'É aceito apenas extensão .png, .jpg e .jpeg', null, null);
        return;
    }
    else if(err.code == 'LIMIT_FILE_SIZE'){
        serverSendingPattern(res, null, 'A imagem enviada é maior que 10 MB', null, null);
        return;
    }
    else{
        console.log(err)
        res.status(500).json({ 'error': 'Erro interno' });
    }
}