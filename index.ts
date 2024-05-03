// import { Leads } from './Classes/Leads';
import { Connection } from './Library/Connection';
import { Message } from './Classes/Message';

async function run() {
  try {
    const control = new Connection('108.181.92.73', 'prole-unify', 'prole-main', 'F^A2#?4yi4ub');

    // Realiza a consulta SQL e trata os resultados
    const interedStorage  = await control.query('SELECT * FROM automatic_engine');

    const controlMessages = new Message("https://api.z-api.io/instances/3AF0D118953200298E3A5EF5ED4F3A62/token/1AF0AC85DCB4EE274FE39BC1/send-messages");

    let count = 0;

    console.log(interedStorage);
    console.log("\n\n");


    for (const row of interedStorage) { 
      const cutLetters = ["(", ")", " ", "-"];
      const phone = row.phone.replace(new RegExp(cutLetters.join("|"), "g"), "");
      const id = row.id;
      const status = row.status;

      
      switch(status) {
        case 0:
          
          console.log(row); 
          console.log("\n");

          const message = `Agradecimentos para a interação com banco de dados e disparo de mensagens com NodeJs e TypeScript!`;
          
          await controlMessages.sendMessage(message, phone);
          await control.update(`UPDATE automatic_engine SET status = 1 WHERE status = 0 AND id = '${id}'`);
          
          setTimeout(function() {
            console.log("Esperou um tempo ae");
          }, 130000);
        
          break;
        default:   
          count++;
      }

    }
  } catch(error) {
    console.error(error);
  }
}

run();