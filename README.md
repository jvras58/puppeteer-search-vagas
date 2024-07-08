# LinkedIn Job Search Bot

Este projeto consiste em um bot que realiza buscas por vagas de emprego no LinkedIn utilizando palavras-chave específicas como "Junior", "Python" e "Remoto". Os resultados são enviados para um canal do Discord. A pesquisa pode ser executada manualmente via uma rota HTTP ou automaticamente diariamente às 9h.

## Requisitos

- Node.js v14 ou superior
- Conta ativa no LinkedIn
- Servidor configurado no Discord
- Bot do Discord configurado

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

3. Configure as variáveis de ambiente:

    - Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:

        ```env
        LINKEDIN_USERNAME=seuemail@seuemail.com
        LINKEDIN_PASSWORD=suasenha
        DISCORD_CHANNEL_ID=ID_DO_CANAL_DISCORD
        DISCORD_TOKEN=TOKEN_DO_BOT
        searchQuery='"Junior" AND "Python" AND "Remoto"'
        ```

    - `searchQuery` é onde você define os critérios da pesquisa para o LinkedIn. Por exemplo, para vagas de estágio em Python e modalidade remota, use: `searchQuery='"Estágio" AND "Python" AND "Remoto"'`.

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

A pesquisa será realizada automaticamente todos os dias às 9h, enviando os resultados para o canal do Discord configurado.

## Estrutura do Projeto

- `index.js`: Configura o servidor Express e as rotas.
- `search.js`: Contém o script Puppeteer que realiza a busca no LinkedIn.
- `discordBot.js`: Configura o bot do Discord e envia as mensagens.
