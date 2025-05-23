import { body } from 'express-validator';

export const validateSystemConfig = [
    body('name')
        .notEmpty().withMessage('Falta o nome')
        .trim()
        .escape()
        .isLength({ min: 2 }).withMessage('Nome precisa ter mais que 2 caracteres')
        .isLength({ max: 100 }).withMessage('O nome deve ter no máximo 100 caracteres'),
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
        .isLength({ min: 2 }).withMessage('Nome precisa ter no mínimo 2 caracteres')
        .isLength({ max: 100 }).withMessage('O nome deve ter no máximo 100 caracteres'),

    body('email')
        .notEmpty().withMessage('Falta o email')
        .normalizeEmail()
        .isEmail().withMessage('Email inválido')
        .isLength({ min: 2 }).withMessage('Email precisa ter no mínimo 2 caracteres')
        .isLength({ max: 100 }).withMessage('O email deve ter no máximo 100 caracteres'),

    body('phone')
        .notEmpty().withMessage('Falta o telefone')
        .isLength({ min: 10, max: 10 }).withMessage('Seu número de telefone deve ter 10 caracteres'),

    body('password')
        .notEmpty().withMessage('Falta a senha')
        .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres')
        .isLength({ max: 30 }).withMessage('A senha deve ter no máximo 30 caracteres')
]

export const validateLogin = [
    body('email')
        .notEmpty().withMessage('Falta o email')
        .normalizeEmail()
        .isEmail().withMessage('Email invalido')
        .isLength({ max: 100 }).withMessage('O email deve ter no máximo 100 caracteres'),

    body('password')
        .notEmpty().withMessage('Falta a senha')
]

export const validateEmail = [
    body('email')
        .notEmpty().withMessage('Falta o email')
        .normalizeEmail()
        .isEmail().withMessage('Email invalido')
        .isLength({ min: 2 }).withMessage('Email precisa ter no mínimo 2 caracteres')
        .isLength({ max: 100 }).withMessage('O email deve ter no máximo 100 caracteres')
]

export const validatePassword = [
    body('password1')
        .notEmpty().withMessage('Falta a senha 1')
        .isLength({ min: 8 }).withMessage('A senha 1 deve ter no mínimo 8 caracteres')
        .isLength({ max: 30 }).withMessage('A senha 1 deve ter no máximo 30 caracteres'),

    body('password2')
        .notEmpty().withMessage('Falta a senha 2')
]

export const validateUpdateInformationUser = [
    body('name')
        .isLength({ min: 2 }).withMessage('Seu nome deve ter no mínimo 2 caracteres')
        .isLength({ max: 100 }).withMessage('Seu nome deve ter no máximo 100 caracteres'),
    body('phone')
        .optional()
        .isLength({ min: 10, max: 10 }).withMessage('Seu número deve ter 10 caracteres'),

    body('description')
        .optional()
        .isLength({ max: 100 }).withMessage('A descrição não pode passar de 100 caracteres'),

    body('street')
        .optional()
        .isLength({ max: 100 }).withMessage('Nome da rua não pode passar de 100 caracteres'),

    body('number')
        .optional()
        .isLength({ max: 20 }).withMessage('O número não pode passar de 20 caracteres'),

    body('neighborhood')
        .optional()
        .isLength({ max: 100 }).withMessage('O bairro não pode passar de 100 caracteres'),
    
    body('zipCode')
        .optional()
        .isLength({ max: 9 }).withMessage('O CEP não pode passar de 9 caracteres'),

    body('city')
        .optional()
        .isLength({ max: 100 }).withMessage('A cidade não pode passar de 100 caracteres'),
    
    body('state')
        .optional()
        .isLength({ min: 2, max: 2 }).withMessage('O estado deve ter 2 caracteres'),
    
    body('complement')
        .optional()
        .isLength({ max: 100 }).withMessage('O complemento não pode passar de de 100 caracteres'),
];