import { createTransport } from 'nodemailer';

const transport = createTransport({
    service: 'gmail',
    auth: {
        'user': process.env.EMAIL,
        'pass': process.env.PASSWORD
    }
});

export default class sendEmail{

    static async sendEmailConfirmationService(email: string, hashEmail: string){

        const emailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Confirmação de email',
            text: '',
            html: `<p>Clique para confirmar seu email</p> <a href="http://localhost:3000/confirmacao/${hashEmail}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;" target="_blank"> Confirme seu e-mail </a>`
        }

        await transport.sendMail(emailOptions);
    }

    static async sendEmailRecoveryPassword(email: string, recoveryHash: string){

        const emailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Redefinição de senha',
            text: '',
            html: `<p>Clique para redefinir sua senha</p> <a href="http://localhost:3000/recuperacao/senha/${recoveryHash}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;" target="_blank"> Redefinir senha </a><br><br><label>Caso não sejá você apenas ignore esse email e avise o suporte sobre o problema.</label>`
        }

        await transport.sendMail(emailOptions);
    }
}