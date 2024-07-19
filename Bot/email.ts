import { Leads } from './Classes/Leads';
import { Message } from './Classes/Message';

import nodemailer from 'nodemailer'; // Certifique-se de importar nodemailer
import { Email } from './Classes/Email';

async function engine() {
  try {
    // Realizar conexão com banco de dados
    // const control = new Leads('108.181.92.73', 'signal_maven', 'maven', 'S1gNal@Mav&n');
    const control = new Leads('127.0.0.1', 'signal_maven', 'root', '1234');

    const data_source = "enginez";

    // Data atual
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Formata a data como "YYYY-MM-DD"
    const currentHour = currentDate.getHours();
    const currentDay = currentDate.getDay();
    
    // Realiza a consulta SQL e trata os resultados
    const holidays  = await control.query("SELECT * FROM holidays");    

    // Verifica se a data atual coincide com alguma das datas retornadas do banco de dados
    const matchingHoliday = holidays.find(holiday => {
      const holidayDate = new Date(holiday.holiday_date);
      return formattedDate === holidayDate.toISOString().split('T')[0];
    });

    if (matchingHoliday) {
      console.log(`Hoje é ${matchingHoliday.holiday_name}.`);
      process.exit(1);
    } else {
      console.log("A data atual não coincide com nenhum feriado no banco de dados.");
    }
    
    console.log(currentDate);
    console.log(formattedDate);
    console.log(currentHour);
    console.log(currentDay);

    // Verificar se o dia atual é sábado (6) ou domingo (0)
    if (currentDay === 6 || currentDay === 0) {
      console.log("É final de semana.");
    } else {
      console.log("Não é final de semana.");
    }

    // Verificar se a hora atual está dentro do horário comercial
    if (currentHour >= 8 && currentHour < 18) {
      console.log("Dentro do horário comercial.");
    } else {
      console.log("Fora do horário comercial.");
      process.exit(1);
    }

    // // Realiza consulta para saber se a base de dados já precisa ser renovada.
    // const storage_status = await control.query("SELECT CASE WHEN (SELECT COUNT(*) FROM engine WHERE status = 1) = (SELECT COUNT(*) FROM engine) THEN 1 ELSE 0 END AS all_equal_one");
    // const all_equal_one = storage_status[0].all_equal_one;

    // if(!all_equal_one) {
    //   // Processo continua disparando para o resto dos dados disponíveis na tabela engine  
    //   console.log("Processo continua disparando para o resto dos dados disponíveis na tabela engine.");
    // } else {
    //   // Toda a base de dados é renovada pois não há informação na tabela engine que possua status 0
    //   // await control.update(`UPDATE engine SET status = 0`);
    //   // console.log("Toda a base de dados foi renovada pois não há informação na tabela engine que possua status 0");
    //   console.log("Final de execução.");
    //   process.exit(1);
    // }

    // Realiza a consulta SQL e trata os resultados
    const interedSheets = await control.query("SELECT * FROM active_sheets WHERE status = 1"); 
    // const interedStorage  = await control.query("SELECT * FROM engine WHERE status = 0");   

    function sleep(ms:any) {
      return new Promise(resolve => {
        const interval = setInterval(resolve, ms);
        // Se precisar cancelar o intervalo antes que ele termine, você pode chamar clearInterval(interval)
      });
    }

    for (const sheet of interedSheets) { 
      const sheet_id = sheet.sheet;
      const sheet_status = sheet.status;
      const sheet_type = sheet.type;

      switch(sheet_status) {
        case 1:

          const intered_storage  = await control.query(`SELECT * FROM ${data_source} WHERE status = 0 AND sheet = ${sheet_id}`);   

          // Consulta SQL para obter o total de mensagens disparadas hoje
          const sqlQuery = `
            SELECT COUNT(*) AS tot_count 
            FROM daily_message_count 
            WHERE date >= CURRENT_DATE AND date < CURRENT_DATE + INTERVAL 1 DAY AND sheet = ${sheet_id};
          `;

          // Executando a consulta SQL
          const messageCountResult = await control.query(sqlQuery);
          const tot_count = messageCountResult[0]["tot_count"];
          let count = 500 - tot_count;
          
          // Verifica se a quantidade de disparos disponíveis no dia já foi finalizada.
          if (count < 1) {
            console.log("O processo fará novos disparos de mensagem amanhã!.");
            process.exit(1); // Exit with error code 1
          }  
          
          const controlMessages = new Message("https://api.z-api.io/instances/3AF0D118953200298E3A5EF5ED4F3A62/token/1AF0AC85DCB4EE274FE39BC1/send-messages");

          for (const row of intered_storage) { 
            const cutLetters = ["(", ")", " ", "-"];
            const phone = row.phone.replace(new RegExp(cutLetters.join("|"), "g"), "");
            const id = row.user_id;
            const status = row.status;
            const name = row.name;
            
            // Verifica se a quantidade de disparos disponíveis no dia já foi finalizada.
            if (count < 1) {
              console.log("O processo fará novos disparos de mensagem amanhã!.");
              process.exit(1); // Exit with error code 1
            }

            switch(status) {
              case 0:
                const email = row.email;
                
                // Função para validar e-mail usando regex
                function is_valid_email() {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  return emailRegex.test(phone);
                }

                function is_valid_phone() {
                  return true;
                }
                
                let type_of_shot = "";
                if(is_valid_email()) {
                  type_of_shot = "email";
                } else if(is_valid_phone()) {
                  type_of_shot = "phone"
                } else {
                  type_of_shot = "";
                }

                switch(type_of_shot) {
                  case "email":

                    // Eu quero que o e-mail tenha esse corpo:
                    const emailMessage = `
                      <body align="center" style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
                
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                          <tr>
                            <td align="center" style="padding-bottom: 20px;">
                              <h1 style="color: #333333; font-size: 24px;">Bolsas de Estudos em Saúde!</h1>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding-bottom: 20px;">
                              <img style="width: 600px; height: 300px;" src="https://proleduca.com.br/email_imagem.png"/>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 20px;">
                              <p style="color: #666666; font-size: 18px; line-height: 1.5;">
                                Fala, <strong>${name}</strong>.
                              </p>
                              <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                                Você já pensou seguir uma carreira na área de saúde, mas não sabe por onde começar?
                                O Prol Educa está aqui para te ajudar a dar o primeiro passo rumo a uma carreira
                                gratificante e cheia de oportunidades!
                  
                                Se liga que a gente tem as melhores Instituições parceiras na área de Saúde.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding-top: 20px;">
                              <a href="https://proleduca.com.br/resultados.php?curso=Enfermagem" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">QUERO MINHA BOLSA!</a>
                            </td>
                          </tr>
                        </table>
                
                      </body>
                    `
                
                    // Definindo a consulta SQL de inserção e os valores a serem inseridos
                    const sql_messages_email = `
                      INSERT INTO messages 
                      (user_id, message_content, sender_name, sender_email, sender_phone, status, sheet, send_date, delivery_status, message_type, delivery_result) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    const values_messages_email = [id, emailMessage, row.name, row.email, row.phone, 1, sheet_id, new Date(), 1, sheet_type, 'Entregue'];
                
                    // Chamando o método insert e tratando o resultado com async/await
                    async function messagesEmail() {
                      try {
                        await control.insert(sql_messages_email, values_messages_email);
                        console.log('Dados inseridos com sucesso!');
                      } catch (error) {
                        console.error('Erro ao inserir dados:', error);
                      }
                    }
                
                    // Chamando a função messagesEmail para executar a inserção
                    messagesEmail();
                
                    // Configuração do Nodemailer (use as configurações apropriadas para seu provedor de e-mail)
                    const transporter = nodemailer.createTransport({
                      host: "smtp.gmail.com", // 'mail.proleduca.com.br', // 'smtp.gmail.com', // substitua pelo seu servidor SMTP
                      port: 587, // 465, // 587, // 587,
                      secure: false, // false, // true para 465, false para outras portas
                      auth: {
                        user: 'kevison.pascoal@gmail.com', // sistema@proleduca.com.br, //  seu e-mail
                        pass: 'raul snee zgqa vszo' // proleduca@2024 'raul snee zgqa vszo'//, // sua senha
                      },
                    });

                    // Criando uma instância da classe Email
                    const emailService = new Email(transporter);

                    // Enviando um e-mail
                    emailService.sendEmail(
                      `${emailMessage}`,
                      `${email}`,
                      'Impulsione sua Carreira com o Prol Educa!'
                    );
                    await control.update(`UPDATE ${data_source} SET status = 1 WHERE status = 0 AND user_id = '${id}'`);

                    break;
                  case "phone":
                    
//                     const message = `📈 Últimas Vagas: Bolsas de até 80% para Enfermagem! 📈

// Aproveite as últimas vagas com bolsas de até 80% para o curso Técnico em Enfermagem! 📊💼

// Impulsione sua carreira em empresas de todos os portes.

// 🔗 Garanta sua vaga!

// Não perca tempo! Assegure seu futuro profissional hoje mesmo!🎓

// Abaixo, o contato para falar com o time especialista 👇
//                     `;

                    const message = `Renove a Bolsa do seu filho(a) e garanta o futuro dele(a)!

Olá, estamos lembrando você que é hora de renovar a Bolsa de Estudo do seu filho(a) na Prol Educa. Não perca os benefícios:

✅ Economia: Evite o reajuste de 2025.
✅ Tranquilidade: Evite despesas acumuladas.

Garanta o futuro brilhante do seu filho(a) agora!

Com gratidão,

Time Prol Educa 🌱

Para renovar, entre em contato pelo número abaixo:
`;
    
                    // Definindo a consulta SQL de inserção e os valores a serem inseridos
                    const sql_messages = `
                      INSERT INTO messages 
                      (user_id, message_content, sender_name, sender_email, sender_phone, status, sheet, send_date, delivery_status, message_type, delivery_result) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
        
                    const values_messages = [id, `${message}`, `${row.name}`, `${row.email}`, `${row.phone}`, 1, sheet_id, new Date(), 1, sheet_type, 'Entregue'];
        
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
                    (user_id, sheet, date) 
                    VALUES (?, ?, ?)
                    `;
                    const values_count = [row.user_id, sheet_id, new Date()]; // Exemplo de valores: user_id = 1, message_count = 10, date = data atual

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
                    await controlMessages.sendContact(phone, "8191506039");
                    await control.update(`UPDATE ${data_source} SET status = 1 WHERE status = 0 AND user_id = '${id}'`);

                    break;
                  default:
                    // comportamento padrão
                }
                
                break;
                default:
                  console.log('RESULTADO PADRÃO DO SISTEMA');  
                
                // Comportamento padrão
              }

            count = count - 1;
            console.log(count);
            // await control.update(`UPDATE active_sheets SET status = 0 WHERE status = 1 AND sheet = ${sheet_id}`);
            await sleep(10000);
          }

          break;
        case 0:

          break;
        default:
          console.log(sheet_status);
      }
    }

    console.log("Aplicação finalizada com sucesso.");
  } catch(error) {
    console.error(error);
  }
}

engine();