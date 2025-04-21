import { Request, Response } from 'express';

import configureSystemService from '../services/system/configureSystemService';

export default async function configureSystemController(req: Request, res: Response){
    configureSystemService(req, res);
}