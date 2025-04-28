import { Request, Response, NextFunction } from "express";

export default function errorHandling(err: any, req: Request, res: Response, next: NextFunction){
    if(err.code == 'LIMIT_UNEXPECTED_FILE'){
        res.status(500).json({ 'erro': 'Você enviou imagem onde não devia ou enviou mais do que devia' });
    }
    else{
        res.status(500).json({ 'erro': 'Erro interno' });
    
    }
}