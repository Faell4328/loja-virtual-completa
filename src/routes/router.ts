import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('opa, tá rodando. Página home')
});

router.use((req: Request, res: Response) => {
    res.status(404).json({"error": "not found"});
})

export { router };