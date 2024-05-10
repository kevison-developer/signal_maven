const students = [
    {
      "responsavel_legal": "Eliane Maia de Oliveira",
      "cidade": "Jaboatão dos Guarapes",
      "estado": "PE",
      "telefone_01": "(81) 98489-1998",
      "email": "",
      "nome_do_aluno": "Luiz philipy de Oliveira lima",
      "idade": "11",
      "turno": "TARDE",
      "ano": "5º Ano - Fundamental I",
      "segmento": "Ensino Fundamental"
    },
    {
      "responsavel_legal": "Josué Valdevino da Silva Filho",
      "cidade": "Jaboatão dos Guararapes",
      "estado": "PE",
      "telefone_01": "(81) 98334-6508",
      "email": "niviaangela0@gmail.com",
      "nome_do_aluno": "Níbia Josuelen Machado Valdevino da Silva",
      "idade": "12",
      "turno": "TARDE",
      "ano": "6º Ano - Fundamental II",
      "segmento": "Ensino Fundamental"
    },
    {
      "responsavel_legal": "Tâmara Gardênia Siqueira e Silva",
      "cidade": "Jaboatão dos Guararapes",
      "estado": "PE",
      "telefone_01": "(81)9989-40577",
      "email": "tamaragardenia.s@hotmail.com",
      "nome_do_aluno": "Alice Queiroz Siqueira",
      "idade": "11",
      "turno": "TARDE",
      "ano": "6º Ano - Fundamental II",
      "segmento": "Ensino Fundamental"
    },
    {
      "responsavel_legal": "GILMAR XAVIER DE ALMEIDA",
      "cidade": "Jaboatão dos Guararapes",
      "estado": "PE",
      "telefone_01": "(81)9876-34664",
      "email": "gilmargil.xavier@gmail.com",
      "nome_do_aluno": "GEORGE XAVIER DA SILVA ALMEIDA",
      "idade": "11",
      "turno": "TARDE",
      "ano": "6º Ano - Fundamental II",
      "segmento": "Ensino Fundamental"
    },
    {
      "responsavel_legal": "Jordana Nayara da Silva Ferreira",
      "cidade": "Jaboatão dos Guararapes",
      "estado": "PE",
      "telefone_01": "(81) 98323-8413",
      "email": "Jpahjordana91@gmail.com",
      "nome_do_aluno": "Ana clara da Silva Ferreira",
      "idade": "12",
      "turno": "TARDE",
      "ano": "7º Ano - Fundamental II",
      "segmento": "Ensino Fundamental"
    },
    {
      "responsavel_legal": "Leonardo França da Rocha",
      "cidade": "Recife",
      "estado": "PE",
      "telefone_01": "(81) 99702-5210",
      "email": "glenda.oliveira@gmail.com",
      "nome_do_aluno": "Alecxander Leonard França de Oliveira",
      "idade": "13",
      "turno": "TARDE",
      "ano": "8º Ano - Fundamental II",
      "segmento": "Ensino Fundamental"
    }
  ];

  const jsonExample = `[
    {
      "responsavel_legal": "Miriam Martins dos Santos lima",
      "cidade": "Jaboatão dos Guararapes",
      "estado": "PE",
      "telefone_01": "(81) 99995-7920",
      "email": "miriammartins2@hotmail.com",
      "nome_do_aluno": "Paulo Myguel de Lima",
      "idade": "12",
      "turno": "TARDE",
      "ano": "6º Ano - Fundamental II",
      "segmento": "Ensino Fundamental"
    },
    {
      "responsavel_legal": "ELIANE ALVES SILVERIO",
      "cidade": "Jaboatão dos Guararapes",
      "estado": "PE",
      "telefone_01": "(81) 98829-6187",
      "email": "elianne_silverio@hotmail.com",
      "nome_do_aluno": "ISABELLY VICTÓRIA SILVERIO DE LIMA",
      "idade": "10",
      "turno": "TARDE",
      "ano": "4º Ano - Fundamental I",
      "segmento": "Ensino Fundamental"
    },
    {
      "responsavel_legal": "Ailton Barbosa de Medeiros Junior",
      "cidade": "Recife",
      "estado": "PE",
      "telefone_01": "(81) 98854-0881",
      "email": "Luizamariadearruda@hotmail.com",
      "nome_do_aluno": "Letícia Alves de Medeiros",
      "idade": "",
      "turno": "TARDE",
      "ano": "1º Ano - Médio",
      "segmento": "Ensino Fundamental"
    },
    {
      "responsavel_legal": "Telma Guedes da Silva",
      "cidade": "Jaboatão dos Guararapes",
      "estado": "PE",
      "telefone_01": "(81) 98343-5328",
      "email": "telmagsilva5@gmail.com",
      "nome_do_aluno": "Miguel Antônio Guedes da Silva",
      "idade": "",
      "turno": "TARDE",
      "ano": "7º Ano - Fundamental II",
      "segmento": "Ensino Fundamental"
    }
  ]`;

  const data = JSON.parse(jsonExample);

  console.log(jsonExample);
  console.log(data);
  process.exit(1);


  // Captar dados específicos, como formato e tipo de disparo

  const filtered_students: { phone: string; name: string; email: string; type: string }[] = [];

  students.forEach(student => {
    const { telefone_01: phone, nome_do_aluno: name, email, segmento: type } = student;

    // Aqui a propriedade phone é formatada par excluir caracteres específicos
    const formatted_phone = phone.replace("(", "").replace(")", "").replace(" ", "").replace("-", "");

    filtered_students.push({ phone: formatted_phone, name, email, type });
  });

//   console.log(filtered_students);