# Sistema de Registro de Ponto

## DEMO
[https://m2-client-production.up.railway.app/](https://m2-client-production.up.railway.app/)

## Dominio da API (Caso queira fazer requisições via Postman, ou similar)
[m2-server-production.up.railway.app](https://m2-server-production.up.railway.app/api)

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

## Observações
