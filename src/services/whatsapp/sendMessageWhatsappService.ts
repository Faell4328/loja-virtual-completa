import axios from "axios";

import { qrcode } from "../../routes/admin";

export default async function sendMessageWhatappService(){
    const clientAxios = axios.create({ baseURL: 'http://localhost:4000' })

    try{
        clientAxios.post('/send', {
            to: "553180160746",
            text: "teste"
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch(error => {
            console.log('Erro ao solicitar o envio da mensagem', error);
        })
    }
    catch(error){
        console.log('Erro ao solicitar o envio da mensagem', error);
    }
}