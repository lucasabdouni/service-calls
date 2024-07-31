# App
Service Call style app.

## RFs (Requisitos functionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível abrir um chamado de serviço;
- [x] Deve ser possível listar os chamados para o setor;
- [x] Deve ser possível listar os por periodo de tempo;
- [] Deve ser possível obter o chamados abertos por um usuario;
- [] Deve ser possível buscar chamado pelo ID;
- [] Deve ser possível editar chamados aberto;
- [] Deve ser possível responder a chamados abertos;
- [] Deve ser possível finalizar um chamado;
- [] Deve ser possível excluir um chamado;
- [] Deve ser possível filtrar uma lista de chamados que acontecerem em um periodo; 

## RNs (Regras de negócios)
- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [] Todo chamado cadastrado deve ser enviado por email para um administrador;
- [] O chamado so pode ser respondido por um administrador ou responsavel da area;
- [] O chamado so pode ser finalizado por um administrador ou responsavel da area;

## RNFS (Requisitos não-funcionais)
- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco SQL;
- [x] Deve ser retornar uma lista com apenas os chamados abertos no mes;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);