
# LinkedIn Job Search Bot

Este projeto é um bot que pesquisa vagas de emprego no LinkedIn com as palavras-chave COMO: ( "Junior", "Python" e "Remoto" ) e envia os resultados para um canal do Discord. A pesquisa pode ser executada manualmente via uma rota HTTP ou automaticamente diariamente às 9h.

## Requisitos

- Node.js v14 ou superior
- Uma conta no LinkedIn
- Um servidor no Discord
- Um bot configurado no Discord

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/jvras58/puppeteer-search-vagas.git
    cd puppeteer-search-vagas
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure as variáveis necessárias:

    - Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais do LinkedIn e o token do bot do Discord:

        ```env
            LINKEDIN_USERNAME=seuemail@seuemail.com
            LINKEDIN_PASSWORD=suasenha
            DISCORD_CHANNEL_ID=ID_CANAL_DISCORD
            DISCORD_TOKEN=TOKEN_BOT
        ```

4. Inicie o servidor:

    ```bash
    node index.js
    ```

## Uso

### Rota Manual

Para executar a pesquisa manualmente, faça uma requisição GET para:

```
http://localhost:3000/pesquisar
```

### Execução Automática

A pesquisa também será executada automaticamente todos os dias às 9h e os resultados serão enviados para o canal do Discord configurado.

## Arquivos do Projeto

- `index.js`: Configura o servidor Express e as rotas.
- `search.js`: Contém o script Puppeteer que faz a pesquisa no LinkedIn.
- `discordBot.js`: Configura o bot do Discord e envia mensagens.

