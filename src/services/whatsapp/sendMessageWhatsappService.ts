import axios from "axios";

export default async function sendMessageWhatappService(number: string, message: string){
    const clientAxios = axios.create({ baseURL: 'http://localhost:4000' })

    try{
        clientAxios.post('/send', {
            to: number,
            text: message
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