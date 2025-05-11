import { Request, Response } from 'express';
import checkStatusWhatsappService from '../../services/whatsapp/checkStatusWhatsappService';

export default async function whatsappController(req: Request, res: Response){
    checkStatusWhatsappService(res);
}