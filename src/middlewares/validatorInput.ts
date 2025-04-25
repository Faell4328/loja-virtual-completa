import { body } from 'express-validator';

export const validateSystemConfig = [
    body('name')
        .notEmpty().withMessage('Falta o nome')
        .trim()
        .escape(),
    body('file').custom((value, {req}) => {
        if(!req.file){
            throw new Error('Falta o arquivo')
        }
        return true;
    })
]

export const validateRegister = [
    body('name')
        .notEmpty().withMessage('Falta o nome')
        .trim()
        .escape()
        .isLength({ min: 2 }).withMessage('Nome precisa ter mais que 2 caracteres'),
    
    body('email')
        .notEmpty().withMessage('Falta o email')
        .normalizeEmail()
        .isEmail().withMessage('Email invalido'),

    body('password')
        .notEmpty().withMessage('Falta a senha')
        .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres')
]