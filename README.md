# Sistema de Registro de Ponto

Trata-se de um sistema de registro de ponto que oferece aos usuários a opção de registrar a entrada, o horário de almoço, o retorno do almoço e a saída. Além disso, os usuários têm acesso aos registros de ponto de datas anteriores na aba "Minha Escala". Nessa aba, eles também têm a capacidade de editar registros de pontos específicos, caso tenham feito um registro incorreto.

O sistema inclui autenticação por meio de tokens, utilizando o Laravel Sanctum para esse fim. Além disso, conta com um middleware que verifica se o usuário possui privilégios administrativos.

Somente usuarios com privilegios administrativos, podem ter acesso as rotas que envolvam:
* Listar todos os colaboradores
* Listar todas as escalas
* Registrar um úsuario / colaborador
* Editar um úsuario / colaborador
* Excluir um úsuario / colaborador
* Registrar uma escala
* Editar uma escala
* Excluir uma escala

dois usuarios já vem registrados automaticamente, afins de teste

<b>Usuario admin:</b> <br>
email: `admin@admin.com`

senha: `admin`

<b> Usuario nao admin: </b> <br>
email: `teste@teste.com`

senha: `12345678`


## DEMO
[https://m2-client-production.up.railway.app/](https://m2-client-production.up.railway.app/)

## Dominio da API (Caso queira fazer requisições via Postman, ou similar)
[https://m2-server-production.up.railway.app](https://m2-server-production.up.railway.app/api)

## Tecnologias utilizadas
- Laravel
- Next.js
- PHP
- JavaScript
- React
- TailwindCSS
- Composer
- Yarn ou NPM

## Instalação
1 - Crie um banco de dados (de preferência `MYSQL`). Utilizei o `MySQL Workbench` para a criação do banco.

2 - Acesse o diretório `server` e configure o arquivo `.env` com os respectivos dados do banco (caso não exista, renomeie o `.env.example` para `.env`).

3 - No diretório `server`, execute o comando `composer install`.

4 - Após a finalização da instalação dos pacotes, execute o comando `php artisan migrate`. Este comando irá criar as tabelas no banco de dados.

5 - Execute o comando `php artisan serve` para iniciar o servidor local na sua máquina(por padrão vem definido como `127.0.0.1:8000`).

6 - No diretório `client`, execute o comando `yarn install` para a instalação dos pacotes de front-end ou `npm install` caso utilize `npm`

7 - Após o download dos pacotes, execute o comando `yarn run dev` no terminal para iniciar o servidor local do cliente, por padrão vem setado `http://localhost:3000`.

8 - Caso não utilize a rota padrão do laravel `127.0.0.1:8000/api/` é importante acessar alguns arquivos do client a seguir e mudar para o Host que você estiver utilizando
* `src\components\adminVerify.ts` linha 26
* `src\contexts\AuthContext.tsx` linha 74
* `src\services\axios.tsx` linha 5

9 - Acesse a rota `http://localhost:3000`

## Arquitetura do banco
![arquitetura-banco](https://github.com/calesj/teste-m2/assets/86434489/ada18a3f-a7c5-478a-8eb5-d6434b7c86c5)


# Rotas da API
## USUARIO
- Fazer login (POST)
`http://127.0.0.1:8000/api/login`

- Registrar um usuario (Requer autenticação, e privilégios administrativos) (POST)
`http://127.0.0.1:8000/api/register`
 
- Retorna as informações do usuario autenticado no momento (Requer autenticação) (GET)
`http://127.0.0.1:8000/api/user`

- Retorna todos os registros de ponto do colaborador logado (Requer autenticação) (GET)
`http://127.0.0.1:8000/time_record/{CollaborateId}`

- Bate o ponto de entrada do úsuario logado (Requer autenticação) (PUT)
`http://127.0.0.1:8000/time_record/entry/{CollaborateId}`

- Bate o ponto de almoço do úsuario logado (Requer autenticação) (PUT)
`http://127.0.0.1:8000/time_record/lunch/{CollaborateId}`

- Bate o ponto de retorno do almoço do úsuario logado (Requer autenticação) (PUT)
`http://127.0.0.1:8000/time_record/return_lunch/{CollaborateId}`

- Bate o ponto de saída do úsuario logado (Requer autenticação) (PUT)
`http://127.0.0.1:8000/time_record/return_lunch/{CollaborateId}`

- Responsavel por alterar registros de uma data especifica do úsuario autenticado caso usuario tenha batido ponto errado (Requer autenticação) (PUT)
`http://127.0.0.1:8000/time_record/update/{CollaborateId}`

- Retorna as informações do usuario, e verifica se ele tem privilegios administrativos (Requer autenticação, e privilégios de administrador) (GET)
`http://127.0.0.1:8000/api/login`

## ESCALAS (Requer autenticação, e privilégios administrativos)
- Retorna todas as escalas cadastradas no banco (GET)
`http://127.0.0.1:8000/timescale/`

- Retorna a escala através do id passado pela url (GET)
`http://127.0.0.1:8000/timescale/{id}`

- Registra uma escala (POST)
`http://127.0.0.1:8000/timescale/`

- Atualiza uma escala existente (PUT)
`http://127.0.0.1:8000/timescale/{id}`

- Exclui uma escala existente (DELETE)
`http://127.0.0.1:8000/timescale/{id}`

## COLABORADOR (Requer autenticação, e privilégios administrativos)
- Retorna todos os colaboradores registrados (GET)
`http://127.0.0.1:8000/collaborator/`

- Retorna todos os colaboradores encontrados através de uma busca (GET)
`http://127.0.0.1:8000/collaborator/search/{search}`

- Retorna o colaborador através de seu ID (GET)
`http://127.0.0.1:8000/collaborator/{id}`

- Reponsavel por alterar os dados de um colaborador (PUT)
`http://127.0.0.1:8000/update/{collaboratorId}`

- Reponsavel por deletar um usuario/Colaborador (PUT)
`http://127.0.0.1:8000/delete/{userId}`
 



