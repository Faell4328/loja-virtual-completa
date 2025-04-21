import { Request, Response, NextFunction } from "express";

export default function errorHandling(err: any, req: Request, res: Response, next: NextFunction){
    if(err.code == 'LIMIT_UNEXPECTED_FILE'){
        console.error('Erro capturado: ', err)
        res.status(500).json({ 'error': 'Você enviou imagem onde não devia ou enviou mais do que devia' });
    }
    else{
        console.error('Erro capturado: ', err)
        res.status(500).json({ 'error': 'Erro interno' });
    
    }
}