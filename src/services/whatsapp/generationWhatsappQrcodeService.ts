import { Response } from 'express';
import eventBus from '../../tools/event';
import { whatsappReady } from '../../routes/admin';

export default function generationWhatsappQrcodeService(res: Response, qrcode: string) {
    if (qrcode !== '') {
        const payload = typeof qrcode === 'string' ? qrcode : JSON.stringify(qrcode);
        res.write(`data: ${payload}\n\n`);
    }

    const onUpdate = (data: any) => {
        if (whatsappReady === true) {
            res.write(`data: "Pronto"\n\n`);
            return;
        }

        const payload = typeof data === 'string' ? data : JSON.stringify(data);
        res.write(`data: ${payload}\n\n`);
    };

    eventBus.on('qrcode_update', onUpdate);

    res.on('close', () => {
        eventBus.off('qrcode_update', onUpdate);
        res.end();
    });
}
