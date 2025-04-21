import { Request, Response } from 'express';
import { unlink, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import DatabaseManager from '../databaseManagerService';

export default async function configureSystemService(req: Request, res: Response){
    const name = req.body.name;
    const file = req.file;

    if(existsSync(resolve(__dirname, '..', '..', '..', 'config.json'))){
        if(file !== undefined){
            unlink(resolve(file.path), (err) => {
                if(err) console.log('erro')
            })
        }
        res.status(307).json({ 'redirect': '/instalacao/admin' });
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
        "name": name,
        "file": file.path,
        "data": data
    };

    writeFileSync(resolve(__dirname, '..', '..', '..', 'config.json'), JSON.stringify(conteudoArquivo));

    DatabaseManager.addSystemConfiguration(name, file.path);

    res.status(307).json({ 'redirect' : '/instalacao/admin' });
    return;
}