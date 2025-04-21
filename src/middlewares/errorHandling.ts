import { Request, Response, NextFunction } from "express";

export default function errorHandling(err: Error, req: Request, res: Response, next: NextFunction){
    console.error('Erro capturado: ', err);
    res.status(500).json({ 'error': 'Erro interno' });
}