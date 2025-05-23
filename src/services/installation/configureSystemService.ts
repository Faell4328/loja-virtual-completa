import DatabaseManager from '../system/databaseManagerService';

export default async function configureSystemService(name: string, file: Express.Multer.File){
    DatabaseManager.addSystemConfiguration(name, file.path);
}