# 🧮 Pondera - Calculadora de GPA

**Conversor de notas do ensino médio brasileiro para o sistema GPA americano**

Uma aplicação web client-side que permite que estudantes brasileiros convertam suas notas do ensino médio para o sistema GPA americano (4.0), facilitando aplicações para universidades estrangeiras.

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)
![Vite](https://img.shields.io/badge/vite-7.1.2-purple.svg)

## 🎯 Funcionalidades

### ✨ Para Estudantes
- **Cálculo instantâneo** de GPA em menos de 2 minutos
- **Suporte a múltiplos sistemas** de notas (0-10, 0-100, A-F, conceitos)
- **Três tipos de GPA**: Unweighted, Weighted e Core GPA
- **Exportação profissional** em PDF, Excel e CSV
- **100% privado** - todos os cálculos no navegador

### 🏫 Para Orientadores
- **Modo lote** para processar múltiplos alunos
- **Templates CSV/Excel** para importação
- **Relatórios consolidados** com estatísticas da turma
- **Processamento de até 100 alunos** simultaneamente

### 📊 Características Técnicas
- **PWA (Progressive Web App)** - funciona offline
- **Responsivo** - otimizado para desktop e mobile
- **Acessível** - WCAG 2.1 nível AA
- **Multilíngue** - Português e Inglês
- **Temas** - Modo claro e escuro

## 🚀 Stack Tecnológica

### Frontend
- **React 19** + **TypeScript 5.8** - Framework e tipagem
- **Vite 7** - Build tool e desenvolvimento
- **TailwindCSS 4** + **DaisyUI 5** - Estilização utility-first
- **Radix UI** - Componentes acessíveis

### Estado e Dados
- **Zustand 5** - Gerenciamento de estado global
- **React Hook Form 7** - Formulários eficientes
- **i18next** - Internacionalização

### Visualização e Exportação
- **Recharts 3** - Gráficos e visualizações
- **jsPDF 3** + **html2canvas** - Geração de PDF
- **PapaParse 5** - Processamento de CSV

### Desenvolvimento
- **ESLint 9** + **TypeScript ESLint** - Linting
- **PostCSS** + **Autoprefixer** - CSS processing
- **Vite PWA Plugin** - Service Workers

## 📦 Instalação

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

### Configuração Local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/pondera.git
cd pondera

# 2. Instale as dependências
npm install

# 3. Execute o ambiente de desenvolvimento
npm run dev

# 4. Acesse no navegador
http://localhost:5173
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build de produção
npm run build

# Preview da build de produção
npm run preview

# Verificação de código (linting)
npm run lint
```

## 📁 Estrutura do Projeto

```
pondera/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (buttons, inputs)
│   │   ├── charts/         # Componentes de gráficos
│   │   └── calculator/     # Componentes específicos da calculadora
│   ├── pages/              # Páginas da aplicação
│   │   ├── HomePage.tsx
│   │   ├── CalculatorPage.tsx
│   │   ├── ResultsPage.tsx
│   │   └── BatchModePage.tsx
│   ├── stores/             # Estado global (Zustand)
│   │   ├── gpaStore.ts
│   │   └── settingsStore.ts
│   ├── utils/              # Utilitários e helpers
│   │   ├── gpaCalculator.ts
│   │   ├── exportUtils.ts
│   │   └── gradeUtils.ts
│   ├── hooks/              # React hooks customizados
│   ├── styles/             # Configurações de estilo
│   │   ├── colors.ts
│   │   └── global.css
│   ├── i18n/               # Internacionalização
│   └── lib/                # Utilitários de terceiros
├── public/                 # Arquivos estáticos
├── docs/                   # Documentação adicional
└── config files           # Vite, TypeScript, ESLint, etc.
```

## 🎨 Design System

### Cores
- **Modo Claro**: Paleta roxa/azul (#6e56cf, #e4dfff)
- **Modo Escuro**: Paleta roxa/lavanda (#a48fff, #2d2b55)

### Componentes
- Baseados em **Radix UI** para acessibilidade
- Estilizados com **TailwindCSS** utility classes
- Variantes usando **class-variance-authority**

### Tipografia
- **Font Family**: Inter, system-ui, sans-serif
- **Escalas responsivas** para diferentes dispositivos

## 🔧 Configuração de Desenvolvimento

### Ambiente
- **Node.js**: 18+
- **Editor recomendado**: VS Code
- **Extensões sugeridas**: 
  - TypeScript
  - TailwindCSS IntelliSense
  - ESLint
  - Prettier

### Padrões de Código
- **TypeScript** obrigatório para novos arquivos
- **ESLint** configurado para React + TypeScript
- **Prettier** para formatação automática
- **Conventional Commits** para mensagens de commit

## 📊 Algoritmo de Conversão GPA

### Tabela de Conversão Padrão
| Nota Brasileira | Nota Americana | GPA Points |
|-----------------|---------------|------------|
| 9.0 - 10.0      | A (90-100)    | 4.0        |
| 8.0 - 8.9       | B (80-89)     | 3.0        |
| 7.0 - 7.9       | C (70-79)     | 2.0        |
| 6.0 - 6.9       | D (60-69)     | 1.0        |
| 0.0 - 5.9       | F (0-59)      | 0.0        |

### Tipos de GPA
- **Unweighted**: Escala padrão 4.0
- **Weighted**: +0.5 para Honras, +1.0 para AP
- **Core GPA**: Apenas matérias principais
- **Cumulative**: Média dos 3 anos do ensino médio

## 🔒 Privacidade e Segurança

- **Zero armazenamento**: Todos os dados processados localmente
- **Sem servidor**: Aplicação 100% client-side
- **Sem cookies**: Apenas localStorage para preferências
- **Código aberto**: Transparência total

## 🌐 Deployment

### Produção
- **Vercel/Netlify**: Deploy automático via GitHub
- **PWA**: Service workers para funcionamento offline
- **CDN**: Distribuição global via Cloudflare

### Monitoramento
- **Google Analytics 4**: Métricas de uso anônimas
- **Web Vitals**: Performance e UX

## 🤝 Contribuição

### Como Contribuir
1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Guidelines
- Siga os padrões de código estabelecidos
- Adicione testes quando aplicável
- Mantenha a documentação atualizada
- Respeite as diretrizes de acessibilidade

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/pondera/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/pondera/discussions)
- **Email**: suporte@pondera.app

---

**Desenvolvido com ❤️ para estudantes brasileiros que sonham com universidades internacionais**