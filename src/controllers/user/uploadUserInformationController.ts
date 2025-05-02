import { Request, Response } from 'express';

import uploadUserInformationService from '../../services/user/uploadUserInformationService';
import { validationResult } from 'express-validator';

export default async function uploadUserInformationController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'erro': errors.errors[0].msg });
    }

    const { phone, description, street, number, neighborhood, zipCode, state, complement } = req.body;

    const address = [ description, street, number, neighborhood, zipCode, state ];

    const someWithValue = address.some(item => item !== undefined);

    const allUndefined = address.every(item => item !== undefined);

    if( someWithValue && !allUndefined ){
        return res.status(400).json({ 'erro': 'Se você colocou algum campo de endereço, deve colocar todos os campos' });
    }

    const statusUpload = await uploadUserInformationService(req.userId, phone, description, street, number, neighborhood, zipCode, state, complement);

    if(statusUpload == false){
        res.status(200).json({ 'error': 'Não foi possível atualizar' });
        return;
    }

    res.status(200).json({ 'ok': 'Informações atualizada' });
    return;
}