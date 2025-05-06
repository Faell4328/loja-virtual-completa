import { Request, Response } from 'express';
import listUsersService from '../../services/admin/listUsersService';

export default async function listUsersController(req: Request, res: Response){
    const users = await listUsersService();

    if(users == null) return res.status(400).json({ 'erro': 'Não foi possível listar os usuários' });

    res.status(200).json({ 'ok': users });
    return;
}