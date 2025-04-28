import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { resolve, extname } from 'path';
import crypto from 'crypto';

type MyFileCallback = (error: Error | null, fileName: string) => void;

export default{
    upload(logo: boolean = false){
        const destinationFolder = resolve(__dirname, '..', '..', 'public', 'files');
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        const storage = multer.diskStorage({
            destination: destinationFolder,
            filename: (request: Request, file: Express.Multer.File, callback: MyFileCallback) => {
                if(logo == true){
                    const ext = extname(file.originalname).toLowerCase();
                    return callback(null, `logo${ext}`);
                }
                else{
                    const fileHash = crypto.randomBytes(16).toString('hex');
                    return callback(null, `${fileHash}-${file.originalname}`);
                }
            }
        });
        function fileFilter(request: Request, file: Express.Multer.File, callback: FileFilterCallback){
            const fileExt = extname(file.originalname).toLowerCase();

            if(allowedExtensions.includes(fileExt)){
                return callback(null, true);
            }
            const error:any = new Error('É aceito apenas extensão .png, .jpg e .jpeg');
            error.code = 'INVALID_FILE_EXTENSION';
            return callback(error, false);
        }
        return{
            storage, 
            fileFilter,
            limits: { fileSize: 10 * 1024 * 1024 }
        }
    }
}