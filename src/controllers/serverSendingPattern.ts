import { Response } from 'express';

export default function serverSendingPattern(res: Response, redirect: string | null, error: string | null, ok: string | null, data: any){
    const message = {
        'redirect': redirect,
        'error': error,
        'ok': ok,
        'data': data
    };

    res.json(message);
}