# App
Service Call style app.

## RFs (Requisitos functionais)

- [] Deve ser possível se cadastrar;
- [] Deve ser possível se autenticar;
- [] Deve ser possível obter o perfil de um usuário logado;
- [] Deve ser possível abrir um chamado de serviço;
- [] Deve ser possível listar os chamados para o setor;
- [] Deve ser possível obter o chamados abertos por um usuario;
- [] Deve ser possível buscar chamado pelo ID;
- [] Deve ser possível editar chamados aberto;
- [] Deve ser possível responder a chamados abertos;
- [] Deve ser possível finalizar um chamado;
- [] Deve ser possível excluir um chamado;
- [] Deve ser possível filtrar uma lista de chamados que acontecerem em um periodo; 

## RNs (Regras de negócios)
- [] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [] O chamado so pode ser respondido por um administrador;
- [] O chamado so pode ser finalizado por um administrador;

## RNFS (Requisitos não-funcionais)
- [] A senha do usuário precisa estar criptografada;
- [] Os dados da aplicação precisam estar persistidos em um banco SQL;
- [] Deve ser retornar uma lista com apenas os chamados abertos no mes;
- [] Todo chamado cadastrado deve ser enviado por email para um administrador;
- [] O usuário deve ser identificado por um JWT (JSON Web Token);