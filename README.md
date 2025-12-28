# 🎲 Bingo App

Aplicação web interativa de Bingo desenvolvida em Angular, onde você pode gerar números aleatórios e acompanhar o progresso do jogo.

## 📋 Características

- **Geração de números múltiplos de 5**: Suporta jogos de 75, 80, 85, 90, 95, 100, 105, 110, 115 até 120 números
- **Persistência de dados**: Salva automaticamente o estado do jogo no LocalStorage
- **Interface intuitiva**: Placar visual com grid 5xN destacando números selecionados
- **Design responsivo**: Funciona perfeitamente em desktop e mobile
- **Controles completos**: Novo jogo, gerar número e salvar jogo

## 🚀 Como Rodar o Aplicativo

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js)

### Instalação

1. **Clone o repositório ou navegue até a pasta do projeto:**
   ```bash
   cd bingo-app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

### Executar em Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```

ou

```bash
ng serve
```

Após executar o comando, o aplicativo estará disponível em:
- **URL**: `http://localhost:4200/`
- O navegador será aberto automaticamente
- A aplicação recarrega automaticamente quando você modifica os arquivos

### Build para Produção

Para criar uma build otimizada para produção:

```bash
npm run build
```

ou

```bash
ng build
```

Os arquivos compilados serão salvos na pasta `dist/bingo-app/`.

### Executar Testes

Para executar os testes unitários:

```bash
npm test
```

ou

```bash
ng test
```

## 🎮 Como Usar o Aplicativo

### Funcionalidades Principais

1. **Iniciar um Novo Jogo:**
   - Selecione o número máximo de números no dropdown (75, 80, 85, 90, etc.)
   - Clique no botão "Novo Jogo"
   - O placar será reiniciado com números embaralhados

2. **Gerar Número:**
   - Clique no botão "Gerar Número"
   - Um número aleatório ainda não selecionado será gerado
   - O número será destacado no placar em verde
   - O jogo é salvo automaticamente após gerar cada número

3. **Salvar Jogo:**
   - Clique no botão "Salvar Jogo" para salvar manualmente o estado atual
   - O jogo também é salvo automaticamente quando você gera um número

4. **Visualizar Progresso:**
   - A barra de progresso mostra quantos números foram selecionados
   - O número atual selecionado é exibido no topo dos controles
   - Números selecionados aparecem destacados em verde no placar

### Estrutura do Placar

O placar é organizado em 5 colunas (B-I-N-G-O) com os números distribuídos:
- Cada coluna representa uma letra da palavra "BINGO"
- Os números são embaralhados a cada novo jogo
- Números selecionados são destacados em verde
- O grid se adapta automaticamente ao número máximo selecionado

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
src/
├── app/
│   ├── components/
│   │   ├── bingo-board/          # Componente do placar
│   │   │   ├── bingo-board.component.ts
│   │   │   ├── bingo-board.component.html
│   │   │   └── bingo-board.component.css
│   │   └── bingo-controls/       # Componente de controles
│   │       ├── bingo-controls.component.ts
│   │       ├── bingo-controls.component.html
│   │       └── bingo-controls.component.css
│   ├── services/
│   │   └── bingo.service.ts      # Serviço com lógica do jogo
│   ├── app.ts                    # Componente principal
│   ├── app.html                  # Template principal
│   ├── app.css                   # Estilos globais
│   └── app.config.ts             # Configuração da aplicação
├── index.html
├── main.ts                       # Ponto de entrada
└── styles.css                    # Estilos globais
```

### Componentes

- **AppComponent**: Componente raiz que integra todos os componentes
- **BingoBoardComponent**: Exibe o placar com os números em grid 5xN
- **BingoControlsComponent**: Contém os controles (botões e seleção de números)

### Serviços

- **BingoService**: Gerencia toda a lógica do jogo:
  - Geração e embaralhamento de números
  - Geração de números aleatórios
  - Persistência no LocalStorage
  - Estado do jogo usando Angular Signals

## 🛠️ Tecnologias Utilizadas

- **Angular 21**: Framework principal
- **TypeScript**: Linguagem de programação
- **Angular Signals**: Para gerenciamento reativo de estado
- **LocalStorage API**: Para persistência de dados
- **CSS3**: Para estilização moderna e responsiva

## 📝 Boas Práticas Implementadas

- ✅ Separação de responsabilidades (lógica no serviço, apresentação nos componentes)
- ✅ Uso de `@Input` e `@Output` para comunicação entre componentes
- ✅ CSS modular para cada componente
- ✅ Código limpo e bem comentado
- ✅ Uso de Angular Signals para gerenciamento de estado
- ✅ Proteção contra SSR (Server-Side Rendering) para LocalStorage
- ✅ Validação de dados antes de salvar/carregar

## 🐛 Resolução de Problemas

### Erro: "localStorage is not defined"
Este erro pode ocorrer durante o build SSR. O código já está protegido contra isso usando `isPlatformBrowser()`, então não deve aparecer em produção.

### O jogo não está salvando
- Verifique se o navegador permite LocalStorage
- Abra o DevTools (F12) e verifique se há erros no console
- Certifique-se de estar executando em um navegador (não em modo SSR durante desenvolvimento)

### Números não estão sendo gerados
- Certifique-se de que iniciou um novo jogo primeiro
- Verifique se ainda há números disponíveis (barra de progresso)

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido com ❤️ usando Angular**
