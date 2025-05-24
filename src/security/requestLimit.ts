import rateLimit from 'express-rate-limit';


export const loginLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    statusCode: 200,
    message: { error: 'Você excedeu o limite de tentativas, tente novamente em 10 minutos' }
});

export const confirmationLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    statusCode: 200,
    message: { error: 'Você excedeu o limite de tentativas, tente novamente em 10 minutos' }
})

export const emailLimit = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    statusCode: 200,
    message: { error: 'Você excedeu o limite de tentativas, tente novamente em 30 minutos' }
})