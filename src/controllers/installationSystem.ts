import { Request, Response } from 'express';
import { unlink, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import DatabaseManager from '../services/databaseManager';
import HashPassword from '../security/hashPassword';

export default class InstallationSystem{
    static configureSystem(req: Request, res: Response){
        const name = req.body.name;
        const file = req.file;

        if(existsSync(resolve(__dirname, '..', '..', 'config.json'))){
            if(file !== undefined){
                unlink(resolve(file.path), (err) => {
                    if(err) console.log('erro')
                })
            }
            res.status(407).json({ 'redirect': '/instalacao/admin' });
            return;
        }

        if(!file){
            res.status(400).json({ 'erro': 'Falta o arquivo' });
            return;
        }
        else if(!name){
            unlink(resolve(file.path), (err) => {
                if(err) console.log('erro')
            })
            res.status(400).json({ 'erro': 'Falta o nome' });
            return;
        }

        let data = new Date();

        let conteudoArquivo = {
            "name": `${name}`,
            "file": `${file.path}`,
            "data": `${data}`
        };

        writeFileSync(resolve(__dirname, '..', '..', 'config.json'), JSON.stringify(conteudoArquivo));

        res.status(407).json({ 'redirect' : '/instalacao/admin' });
        return;
    }
    
    static async createUserAdmin(req: Request, res: Response){
        if(!existsSync(resolve(__dirname, '..', '..', 'config.json'))){
            res.status(407).json({ 'redirect': '/instalacao/config' });
            return;
        }

        const { name, email, password } = req.body;

        if(!name){
            res.status(400).json({ 'erro': 'Falta o nome'});
        }
        else if(!email){
            res.status(400).json({ 'erro': 'Falta o email'});
        }
        else if(!password){
            res.status(400).json({ 'erro': 'Falta o password'});
        }
        else{
            let hashPassword:string = await HashPassword.passwordHashGenerator(password);
            DatabaseManager.createrUserAdmin({ name, email, hashPassword });
            
            res.status(200).json({ 'ok': 'Conta criada, o servidor será reiniciado em 5 segundos' });
            setTimeout( () => process.exit(0), 5000)
            return;
        }
    }

    static routerDefault (req: Request, res: Response){
        if(existsSync(resolve(__dirname, '..', '..', 'config.json'))){
            res.status(407).json({ 'redirect': '/instalacao/admin' });
        }
        else{
            res.status(407).json({ 'redirect': '/instalacao/config' });
        }
    }
}