import { Request, Response, NextFunction } from "express";

export default function errorHandling(err: any, req: Request, res: Response, next: NextFunction){
    if(err.code == 'LIMIT_UNEXPECTED_FILE'){
        res.status(500).json({ 'erro': 'Você enviou imagem onde não devia ou enviou mais do que devia' });
    }
    else if(err.code == 'INVALID_FILE_EXTENSION'){
        res.status(500).json({ 'erro': 'É aceito apenas extensão .png, .jpg e .jpeg' });
    }
    else if(err.code == 'LIMIT_FILE_SIZE'){
        res.status(500).json({ 'erro': 'A imagem enviada é maior que 10 MB' });
    }
    else{
        res.status(500).json({ 'erro': 'Erro interno' });
    
    }
}