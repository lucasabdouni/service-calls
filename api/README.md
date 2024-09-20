# App
Service Call style app.

## RFs (Requisitos functionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível listar as solicitações de um departamento;
- [x] Deve ser possível listar solicitações do setor por periodo de tempo;
- [x] Deve ser possível obter o chamados abertos por um usuario;
- [x] Deve ser possivel criar um serviço; 
- [x] Deve ser possivel editar um serviço; 
- [x] Deve ser possivel deletar um serviço; 
- [x] Deve ser possível abrir uma solicitação de serviço;
- [x] Deve ser possível buscar uma solicitação pelo ID;
- [x] Deve ser possível editar uma solicitação em aberto;
- [x] Deve ser possível responder uma solicitação em abertos;
- [x] Deve ser possível finalizar uma solicitação;
- [x] Deve ser possível excluir uma solicitação;
- [x] Deve ser possível filtrar uma lista de solicitações que acontecerem em um periodo; 
- [ ] Deve ser contado o tempo da solicitação em execusão; 
- [ ] Deve ser possivel pausar um chamado em execução; 
- [x] Deve ser obter metricas de um usuario; 

## RNs (Regras de negócios)
- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não deve poder se cadastrar com uma matricula duplicada;
- [x] Todo chamado cadastrado deve ser enviado por email para os responsaveis do setor;
- [x] O serviço deve ser associado a um departamento;
- [x] O serviço deve ter sua hora de execução;
- [ ] A solicitação deve ser associada a um departamento, serviço e usuario;
- [ ] A solicitação deve ser associado ao serviço pelo usuario ou pelo responsavel;
- [x] Toda edição no chamado deverá ser enviado por email para o usuario que a solicitou;
- [x] O chamado so pode ser respondido por um administrador ou responsavel da area;
- [x] O chamado so pode ser editado por um administrador ou responsavel da area;
- [x] O chamado so pode ser finalizado por um administrador ou responsavel da area;
- [ ] A comunição de start e pausa de execução de um chamado deve estar em websocket;

## RNFS (Requisitos não-funcionais)
- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco SQL;
- [x] Deve ser retornar uma lista com apenas os chamados abertos no mes;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);
- [x] Os dados da hora do chamado deve ser feito em timestamp;