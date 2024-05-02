import { Leads } from './Classes/Leads';
import { Message } from './Classes/Message';

// Exemplo de uso
const message = new Message("https://api.z-api.io/instances/3AF0D118953200298E3A5EF5ED4F3A62/token/1AF0AC85DCB4EE274FE39BC1/send-messages");

// Exemplo de uso
const connection = new Leads('108.181.92.73', 'prole634_local', 'prole', 'F^A2#?4yi4ub');

message.sendMessage("Agradecimentos para a interação com banco de dados e disparo de mensagens com NodeJs e TypeScript!", "81983345951");