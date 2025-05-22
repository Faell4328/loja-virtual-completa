import { Request, Response } from 'express';

import { validationResult } from 'express-validator';
import sendResponse from '../controllerSendPattern';
import uploadUserInformationService from '../../services/user/uploadUserInformationService';

export default async function uploadUserInformationController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        sendResponse(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { name, phone, description, street, number, neighborhood, zipCode, state, city, complement } = req.body;

    const address = [ description, street, number, neighborhood, zipCode, state, city, complement ];

    const someWithValue = address.some(item => item !== undefined);
    address.pop();

    const allUndefined = address.every(item => item !== undefined);

    if( someWithValue && !allUndefined ){
        sendResponse(res, null, 'Se você colocout algum campo de endereço, deve colocar todos os campos', null, null);
        return;
    }

    const statusUpload = await uploadUserInformationService(req.userId, name, phone, description, street, number, neighborhood, zipCode, city, state, complement);

    if(statusUpload == false){
        sendResponse(res, null, 'Não foi possível atualizar', null, null);
        return;
    }

    sendResponse(res, null, null, 'Informação atualizada', null);
    return;
}