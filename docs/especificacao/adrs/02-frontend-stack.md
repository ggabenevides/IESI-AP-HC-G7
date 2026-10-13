# Adotar Vue 3 + TypeScript + Vite como stack de frontend do framework institucional

## Contexto e Problema

O HC-UFPE mantém diversos sistemas internos. Sem um padrão, cada sistema tende a nascer com uma stack de interface diferente, o que pode dificultar a manutenção dos projetos.

Ao criar um framework base para todos os novos sistemas, a equipe precisava escolher uma stack de frontend que atendesse a alguns pontos:

* ter curva de aprendizado baixa para desenvolvedores acostumados a Python e HTML;
* oferecer tipagem para reduzir erros em telas com muitos formulários e dados clínicos;
* integrar-se ao modelo de segurança do framework (JWT de acesso + refresh em cookie HttpOnly, autenticação no AD);
* permitir uma biblioteca de componentes reutilizáveis (tabelas, modais, cards, botões) comum a todos os sistemas.

Qual stack de frontend adotar como padrão institucional para os sistemas do HC-UFPE?

## Opções Consideradas

* Vue 3 + TypeScript + Vite (com Pinia, Vue Router e Tailwind CSS)
* React + TypeScript + Vite
* Angular
* Páginas renderizadas no servidor (Jinja2 + HTMX/Alpine.js)

## Resultado da Decisão

Opção escolhida: "Vue 3 + TypeScript + Vite", porque oferece o melhor equilíbrio entre simplicidade de aprendizado (templates próximos de HTML, Single File Components) e estrutura de SPA moderna (roteamento, estado global, tipagem), além de gerar um build estático que o FastAPI serve diretamente.

Motivos prováveis para descartar as alternativas:

* React: ecossistema maior, mas exige JSX e mais decisões de arquitetura (roteamento, estado, formulários) a cargo da equipe — mais custo para um time com perfil Python.
* Angular: robusto e opinativo, mas verboso e com curva de aprendizado alta (RxJS, módulos, injeção de dependência) para o porte dos sistemas internos.
* Jinja2 + HTMX: mais simples para quem vem do Python, mas acopla interface e backend, dificulta componentes reutilizáveis ricos e não se encaixa bem no fluxo de JWT com refresh transparente.

Escolhas complementares, cada uma com a motivação inferida:

| Função | Tecnologia | Motivação provável |
| :--- | :--- | :--- |
| Framework de UI | Vue 3 (Composition API) | Templates próximos de HTML e reaproveitamento de lógica via composables |
| Linguagem | TypeScript (`vue-tsc`) | Detectar erros de tipo no build, antes de chegar à produção |
| Build / Dev server | Vite | Build rápido; `outDir` aponta para `src/static/dist` e o proxy `/api` integra com o FastAPI em desenvolvimento |
| Estado global | Pinia | Padrão oficial do Vue 3; guarda sessão (`stores/auth.ts`) e estado de UI (`stores/ui.ts`) |
| Roteamento | Vue Router | Navegação de SPA com guarda de rotas autenticadas |
| Estilização | Tailwind CSS 4 | Padronização visual sem escrever CSS próprio em cada sistema; grid no estilo Bootstrap montado sobre Tailwind |
| Cliente HTTP | Axios | Interceptadores centralizam o envio do token e o refresh automático em respostas 401 |
| Formulários | VeeValidate + Zod | Sistemas hospitalares são intensivos em formulários; Zod dá validação tipada e declarativa |
| Ícones e feedback | Heroicons, vue-toastification | Ícones consistentes com Tailwind e notificações padronizadas |

### Consequências

* Positivo, porque o deploy fica simples: o Node é usado só no build (estágio 1 do `Dockerfile`) e o FastAPI serve os arquivos estáticos em produção.
* Positivo, porque o refresh de token transparente no Axios combina com a estratégia de segurança do backend (refresh token em cookie HttpOnly).
* Positivo, porque a biblioteca de componentes (`DataTable`, `Modal`, `Card`, `Button`) e o layout padrão (com a versão SemVer no rodapé) aceleram a criação de novos módulos.
* Negativo, porque a equipe passa a manter duas linguagens (Python e TypeScript) e um ecossistema Node apenas para o build.
* Negativo, porque o Tailwind CSS foi adotado ainda em versão alpha (`^4.0.0-alpha.17`), o que pode trazer quebras ao atualizar dependências.
* Negativo, porque as regras de validação ficam duplicadas: os schemas Zod do frontend precisam ser mantidos em sincronia manual com os schemas Pydantic do backend, sob risco de uma tela aceitar dados que a API rejeita (ou vice-versa).
