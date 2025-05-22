import rateLimit from 'express-rate-limit';

export const emailConfirmationLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    statusCode: 200,
    message: { error: 'Você excedeu o limite de tentativas, tente novamente em 10 minutos' }
})

export const loginLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    statusCode: 200,
    message: { error: 'Você excedeu o limite de tentativas, tente novamente em 10 minutos' }
});

export const resendEmailLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    statusCode: 200,
    message: { error: 'Você já solicitou o reenvio 3 vezes, por favor aguarde 1 hora' }
})