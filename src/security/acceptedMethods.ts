import { Request, Response, NextFunction } from 'express';

const methods = [ 'GET', 'POST', 'PULL', 'DELETE' ];

export default function acceptedMethod(req: Request, res: Response, next: NextFunction){
    if(!methods.includes(req.method)){
        res.status(405).json({ 'erro': 'Method não aceito' });
        return;
    }
    next();
    return;
}