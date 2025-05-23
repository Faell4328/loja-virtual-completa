import { Request, Response } from 'express';

import serverSendingPattern from '../serverSendingPattern';
import { validationResult } from 'express-validator';
import { deleteUserAddressInformationService, listUserInformationService, uploadUserInformationService } from '../../services/user/informationService';

export async function listUserInformationController(req: Request, res: Response){
    const userInformation = await listUserInformationService(req.userId);

    if(userInformation == null){
        serverSendingPattern(res, null, 'Problema ao listar', null, null);
        return;
    }

    serverSendingPattern(res, null, null, null, userInformation);
    return;
}

export async function uploadUserInformationController(req: Request, res: Response){
    
    const errors:any = validationResult(req);
    
    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { name, phone, description, street, number, neighborhood, zipCode, state, city, complement } = req.body;

    const address = [ description, street, number, neighborhood, zipCode, state, city, complement ];
    
    const someWithValue = address.some(item => item !== undefined);
    address.pop();
    
    const allUndefined = address.every(item => item !== undefined);
    
    if( someWithValue && !allUndefined ){
        serverSendingPattern(res, null, 'Se você colocout algum campo de endereço, deve colocar todos os campos', null, null);
        return;
    }

    const statusUpload = await uploadUserInformationService(req.userId, name, phone, description, street, number, neighborhood, zipCode, city, state, complement);
    
    if(statusUpload == false){
        serverSendingPattern(res, null, 'Não foi possível atualizar', null, null);
        return;
    }
    
    serverSendingPattern(res, null, null, 'Informação atualizada', null);
    return;
}

export async function deleteUserAddressInformationController(req: Request, res: Response){
    const statusAddress = await deleteUserAddressInformationService(req.userId);
    if(statusAddress == false){
        serverSendingPattern(res, null, 'Você não possui endereço cadastrado', null, null);
        return;
    }

    serverSendingPattern(res, null, null, 'Endereço deletado', null);
    return;
}