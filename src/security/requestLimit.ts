import rateLimit from 'express-rate-limit';

export const emailConfirmationLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: { erro: 'Você excedeu o limite de tentativas, tente novamente em 10 minutos' }
})

export const loginLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: { erro: 'Você excedeu o limite de tentativas, tente novamente em 10 minutos' }
});