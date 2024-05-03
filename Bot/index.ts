// import { Connection } from './Library/Connection';
import { Leads } from './Classes/Leads';
import { Message } from './Classes/Message';

async function engine() {
  try {
    const control = new Leads('108.181.92.73', 'signal_maven', 'maven', 'S1gNal@Mav&n');

    // Realiza a consulta SQL e trata os resultados
    const interedStorage  = await control.query("SELECT * FROM engine");    
    
    // Data atual
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Formata a data como "YYYY-MM-DD"

    // Consulta SQL para obter o total de mensagens disparadas hoje
    const sqlQuery = `
      SELECT COUNT(*) AS tot_count 
      FROM daily_message_count 
      WHERE date >= CURRENT_DATE AND date < CURRENT_DATE + INTERVAL 1 DAY;
    `;

    // Executando a consulta SQL
    const messageCountResult = await control.query(sqlQuery);
    const tot_count = messageCountResult[0]["tot_count"];
    let count = 50 - tot_count;

    const controlMessages = new Message("https://api.z-api.io/instances/3AF0D118953200298E3A5EF5ED4F3A62/token/1AF0AC85DCB4EE274FE39BC1/send-messages");


    function sleep(ms:any) {
      return new Promise(resolve => {
        const interval = setInterval(resolve, ms);
        // Se precisar cancelar o intervalo antes que ele termine, você pode chamar clearInterval(interval)
      });
    }

    for (const row of interedStorage) { 
      const cutLetters = ["(", ")", " ", "-"];
      const phone = row.phone.replace(new RegExp(cutLetters.join("|"), "g"), "");
      const id = row.id;
      const status = row.status;
      
      if (count < 1) {
        console.log("Count is less than 1. Exiting application.");
        process.exit(1); // Exit with error code 1
      }  

      switch(status) {
        case 0:
          
          const message = `Agradecimentos para a interação com banco de dados e disparo de mensagens com NodeJs e TypeScript!`;

          // Definindo a consulta SQL de inserção e os valores a serem inseridos
          const sql_messages = `
            INSERT INTO messages 
            (user_id, message_content, sender_name, sender_email, sender_phone, status, send_date, delivery_status, message_type, delivery_result) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const values_messages = [1, `${message}`, `${row.name}`, `${row.email}`, `${row.phone}`, 1, new Date(), 1, 'message', 'Entregue'];

          // Chamando o método insert e tratando o resultado com async/await
          async function messages() {
            try {
              await control.insert(sql_messages, values_messages);
              console.log("Dados inseridos com sucesso!");
            } catch (error) {
              console.error("Erro ao inserir dados:", error);
            }
          }
          
          // Chamando a função inserirDados para executar a inserção
          messages();

          // Definindo a consulta SQL de inserção e os valores a serem inseridos
          const sql_daily_message_count = `
          INSERT INTO daily_message_count 
          (user_id, message_count, date) 
          VALUES (?, ?, ?)
          `;
          const values_count = [row.user_id, 10, new Date()]; // Exemplo de valores: user_id = 1, message_count = 10, date = data atual

          // Chamando o método insert e tratando o resultado com async/await
          async function daily_message_count() {
            try {
              await control.insert(sql_daily_message_count, values_count);
              console.log('Dados inseridos com sucesso na tabela daily_message_count!');
            } catch (error) {
              console.error('Erro ao inserir dados na tabela daily_message_count:', error);
            }
          }

          // Chamando a função inserirDados para executar a inserção
          daily_message_count();
          
          await controlMessages.sendMessage(message, phone);
          // await control.update(`UPDATE engine SET status = 1 WHERE status = 0 AND user_id = '${id}'`);
          
          break;
          default:  
          // 
        }
        
        count -= 1;
        console.log(count);
        await sleep(10000);
    }


  } catch(error) {
    console.error(error);
  }
}

engine();