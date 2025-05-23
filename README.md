## Objetivo

Sistema completo de loja virtual, com foco em controle de clientes, estoque e vendas.
Projetado para ser flexível e atender diversos tipos de comércio (ex: roupas, peças automotivas etc).

O sistema busca ser o mais simples, intuitivo e direto possível, oferecendo:
- Cadastro e gerenciamento de clientes.
- Controle de estoque e movimentações.
- Relatórios (estoque, vendas e clientes).
- Máximo controle para administradores.
- Notificações via e-mail e WhatsApp.
- Integração com gateways de pagamento (possívelmente Asaas).

> ⚠️ **Status:** Em desenvolvimento.

<hr>

## Tecnologias e bibliotecas utilizadas
### Backend:
- axios — cliente HTTP para requisições
- bcryptjs — hash de senhas
- cookie-parser — leitura e manipulação de cookies
- cors — controle de acesso entre origens (CORS)
- dotenv — gerenciamento de variáveis de ambiente
- eventsource — cliente para EventSource (SSE - Server-Sent Events)
- express-rate-limit — proteção contra ataques de força bruta (rate limiting)
- express-validator — validação de dados em rotas Express
- Express — framework HTTP para Node.js
- multer — middleware para upload de arquivos
- nodemailer — envio de e-mails via SMTP
- Prisma ORM — acesso e manipulação do banco de dados usando ORM
- qrcode — geração de códigos QR
- swagger-ui-express — documentação interativa para APIs REST
- whatsapp-web.js — biblioteca para enviar mensagens via WhatsApp Web

### Desenvolvimento e testes:
- TypeScript
- Jest + Supertest — testes automatizados
- Docker e docker-compose

### Funcionalidades já implementadas
- Configuração inicial do sistema (nome da loja, logotipo)
- Criação da conta de administrador
- Login, cadastro de usuários
    - Envio de e-mail de confirmação no cadastro
- Logout
- Envio de e-mail de ativação
- Reenvio de e-mail de ativação (caso falhe)
- Recuperação de senha via e-mail
- Proteções contra ataques XSS e brute force
- Listagem de usuários (admin)
- Consulta de informações de um usuário específico (admin)
- Adição, edição e exclusão de informações do usuário
- Notificação via WhatsApp (ex: login realizado, foi solicitado redefinição de senha e etc).
    ! É necessário ter conectado o WhatsApp!