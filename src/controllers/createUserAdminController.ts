import { Request, Response } from 'express';

import createrUserAdminService from '../services/admin/createUserAdminService';

export default async function createUserAdmin(req: Request, res: Response){
    createrUserAdminService(req, res);
}