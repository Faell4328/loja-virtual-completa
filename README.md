## Objetivo

Sistema completo de loja virtual, com foco em controle de clientes, estoque e vendas.
Projetado para ser flexível e atender diversos tipos de comércio (ex: roupas, peças automotivas etc).

O sistema busca ser o mais simples, intuitivo e direto possível, oferecendo:
- Cadastro e gerenciamento de clientes.
- Controle de estoque e movimentações.
- Relatórios personalizados.
- Máximo controle para administradores.
- Notificações via e-mail e WhatsApp.
- Integração com gateways de pagamento.

> ⚠️ **Status:** Em desenvolvimento (somente backend, ainda sem frontend).

<hr>

## Tecnologias e bibliotecas utilizadas
### Backend:
- Express — framework HTTP
- Prisma ORM — acesso ao banco de dados
- bcryptjs — hash de senhas
- dotenv — gerenciamento de variáveis de ambiente
- cors — controle de acesso entre origens
- cookie-parser — leitura e manipulação de cookies
- multer — upload de arquivos
- nodemailer — envio de e-mails
- express-rate-limit — proteção contra brute force
- express-validator — validação de dados
- whatsapp-web.js — envio de mensagens via WhatsApp
- qrcode — geração de QR Code para conexão ao WhatsApp

### Desenvolvimento e testes:
- TypeScript
- Jest + Supertest — testes automatizados

### Funcionalidades já implementadas
- Configuração inicial do sistema (nome da loja, logotipo)
- Criação da conta de administrador
- Login e cadastro de usuários
    - Envio de e-mail de confirmação no cadastro
- Reenvio de e-mail de ativação (caso falhe)
- Recuperação de senha via e-mail
- Proteções contra ataques XSS e brute force
- Listagem de usuários (admin)
- Consulta de informações de um usuário específico (admin)
- Adição, edição e exclusão de informações do usuário