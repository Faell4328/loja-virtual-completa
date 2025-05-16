import { Request, Response, NextFunction } from 'express';

const methods = [ 'GET', 'POST', 'PUT', 'DELETE' ];

export default function acceptedMethod(req: Request, res: Response, next: NextFunction){
    if(!methods.includes(req.method)){
        res.status(405).json({ 'error': 'Method não aceito' });
        return;
    }
    next();
    return;
}