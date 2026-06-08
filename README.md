# 📚 BiblioTech - Sistema de Gestão de Biblioteca

O **BiblioTech** é uma aplicação web moderna e intuitiva projetada para simplificar a administração de acervos literários e o controle de empréstimos em instituições de ensino e bibliotecas comunitárias. 

O sistema foi desenvolvido com foco em alta usabilidade, permitindo que os operadores gerenciem livros, alunos e prazos de devolução de forma rápida e eficiente.

---

## 💻 Funcionalidades Principais

### 1. 📖 Gestão do Acervo (Livros)
* **Visualização em Cards:** Catálogo visual moderno que permite identificar rapidamente os livros pelo título, autor e gênero.
* **Status em Tempo Real:** Cada livro exibe uma tag visual indicando se ele está `Disponível` na estante ou `Emprestado`.
* **Filtros Avançados:** Busca inteligente por título, filtragem dinâmica por gênero literário e controle de exibição sob demanda.
* **Histórico Dedicado por Livro:** Ao clicar em um livro, o sistema abre um relatório cronológico detalhado com todos os empréstimos já feitos especificamente para aquele exemplar.

### 2. 🤝 Controle de Empréstimos Ativos
* **Painel de Controle:** Centraliza todos os empréstimos que estão atualmente nas mãos dos estudantes (pendentes de devolução).
* **Identificação de Atrasos:** O sistema calcula automaticamente os prazos. Caso a data limite seja ultrapassada, o card do empréstimo ganha uma borda vermelha, um alerta de `(ATRASADO)` e é jogado automaticamente para o topo da lista para ação imediata de cobrança.
* **Devolução Simplificada:** Processo de baixa no sistema com apenas um clique após a confirmação visual da entrega do livro físico.

### 3. 📋 Relatório Geral de Histórico 
* **Auditoria Completa:** Uma aba dedicada para exibir o fluxo histórico completo de movimentações da biblioteca (tanto empréstimos ativos quanto os já devolvidos).
* **Inteligência de Filtragem:** Permite analisar de forma global quem leu o quê, quais livros já retornaram ao acervo com sucesso e quais geraram atrasos históricos, servindo como base de dados para estatísticas da instituição.

---

## ⚙️ Arquitetura do Sistema

O sistema é dividido em duas partes essenciais que garantem flexibilidade e organização:

### 📑 Constantes e Dados Centrais
* **Gêneros Padronizados:** Lista predefinida de gênero literário utilizada em todo o sistema para evitar cadastros duplicados ou erros de digitação.

### 🖥️ Interface de Usuário (UI)
* **Navegação por Abas Dinâmicas:** Gerenciamento de rotas internas (`livros`, `emprestimos` e `historico`) acopladas a um cabeçalho fixo com efeito visual de abas integradas.
* **Formulários Unificados:** Telas de cadastro e edição padronizadas, com inputs limpos, foco inteligente e botões acessíveis.
* **Camadas Isoladas (Modais via Portals):** Os relatórios e telas de detalhes flutuam de forma independente sobre a aplicação, garantindo que menus superiores ou barras laterais nunca atrapalhem a leitura dos dados.

---

## 🛠️ Tecnologias Utilizadas

* **Ambiente de Desenvolvimento:** Vite 8 ⚡
* **Frontend:** React 19 (Componentização baseada em estados dinâmicos e Portals)
* **Estilização:** CSS3 (Grid Layout, Flexbox e Design Responsivo)
* **Componentes de Seleção:** React Select 5 (Dropdowns fluidos para filtros)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina o **Node.js** e o gerenciador de pacotes **npm**.

### 🔗 1. Clonar e Rodar a API (Backend)
Este projeto **depende do serviço da API** para persistência e manipulação dos dados de livros e empréstimos.
1. Acesse o repositório do backend em: [API Biblioteca](https://github.com/liandersonDesen/API-Biblioteca.git)


2. Siga as instruções do README da API para instalá-la e colocá-la em execução (por padrão roda em `http://localhost:3000`).

### 💻 2. Rodar o Frontend (BiblioTech)

Com a API rodando em segundo plano, abra um novo terminal e siga os passos abaixo:

1. **Clonar este repositório:**
   ```bash
   git clone https://github.com/liandersonDesen/biblioteca-front.git

2. **Entrar na pasta do projeto:**
    ```bash
    cd biblioteca-front

3. **Instalar as dependências do projeto:**
    ```bash
    npm install

4. **Iniciar o servidor de desenvolvimento (Vite):**

    ```bash
    npm run dev

A aplicação iniciará localmente. O terminal exibirá o endereço gerado pelo Vite (geralmente http://localhost:5173). Basta abrir esse link no seu navegador para utilizar o sistema completo integrado com o banco de dados!