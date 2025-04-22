import { unlink, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import DatabaseManager from '../databaseManagerService';

export default async function configureSystemService(name: string, file: Express.Multer.File){

    if(existsSync(resolve(__dirname, '..', '..', '..', 'config.json'))){
        if(file !== undefined){
            unlink(resolve(file.path), (err) => {
                if(err) console.log('erro')
            })
        }
        return true;
    }


    let data = new Date();

    let conteudoArquivo = {
        "name": name,
        "file": file.path,
        "data": data
    };

    writeFileSync(resolve(__dirname, '..', '..', '..', 'config.json'), JSON.stringify(conteudoArquivo));

    DatabaseManager.addSystemConfiguration(name, file.path);

    return true;
}