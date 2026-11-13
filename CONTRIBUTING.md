# Guia de Contribuição — Sistema AP (HC-UFPE)

Este guia explica como a equipe do **G7 de IESI** trabalha no **Sistema de Gestão Integrada de Serviços de Anatomia Patológica**: como o time está organizado, como funciona o revezamento semanal e qual é o caminho de uma tarefa até o merge.

---

## Sumário

1. [Antes de começar](#antes-de-começar)
2. [Organização do time](#organização-do-time)
3. [Revezamento semanal](#revezamento-semanal)
4. [Pair programming](#pair-programming)
5. [Fluxo de trabalho](#fluxo-de-trabalho)
6. [Branches](#branches)
7. [Commits](#commits)
8. [Pull Requests](#pull-requests)
9. [Code review](#code-review)
10. [Dados de pacientes e LGPD](#dados-de-pacientes-e-lgpd)
11. [Uso de IA](#uso-de-ia)
12. [Definição de pronto](#definição-de-pronto)

---

## 1. Antes de começar

### 1.1. Leituras obrigatórias

| O quê | Onde | Por quê |
| --- | --- | --- |
| Especificação do sistema | `docs/especificacao/`, começando por `SPEC.md` | É a **fonte de verdade de negócio**. Se o protótipo e a especificação não baterem, vale a especificação. |
| Regras da arquitetura | `AGENTS.md` e `docs/ARCHITECTURE.md` | Camadas Roteador → Controller → Provedor, segurança e auditoria |
| Como criar telas e rotas | `docs/GUIA_DESENVOLVIMENTO.md` | Passo a passo do framework |
| Specs vigentes | `openspec/specs/` | O que já está especificado em detalhe, por capacidade |

### 1.2. Ambiente

Pré-requisitos: **Python 3.12+**, **uv**, **Node.js** e **npm**.

```bash
git clone https://github.com/ggabenevides/IESI-AP-HC-G7.git
cd IESI-AP-HC-G7
cp .env.example .env      # para trabalhar offline, use os provedores CSV
./dev.sh                  # backend em :8000 e frontend em :5173, com hot reload
```

Antes de abrir um PR, rode as verificações:

```bash
python audit_framework.py .              # precisa dar 100% (11/11)
cd frontend && npx vue-tsc --noEmit      # o frontend não pode ter erros de tipo
uv run pytest                            # sempre que mexer no backend
```

Se algo não funcionar no setup, avise no grupo. Um setup quebrado é problema do time, não só de quem está tentando rodar.

---

## 2. Organização do time

O time tem **6 pessoas**, divididas em **3 duplas fixas**. Cada dupla é dona de um conjunto de interfaces, separadas por stakeholder (os atores de `03-casos-uso.md`).

As duas pessoas que estão começando a programar ficam em **duplas diferentes**, cada uma com alguém mais experiente, que chamamos de *referência*.

### 2.1. Duplas e módulos

| Dupla | Pessoas | Módulos (interfaces) | Atores atendidos | Escopo |
| --- | --- | --- | --- | --- |
| **A** | Ádson (referência) + Sophia (iniciante) | Recepção e Arquivo | Recepcionista, Técnico do Arquivo | `recepcao`, `devolucoes`, `arquivo` |
| **B** | Matheus (referência) + Marcela(iniciante) | Macroscopia e Processamento técnico/IHQ | Técnicos de Macroscopia, Processamento e IHQ | `macroscopia`, `processamento`, `ihq` |
| **C** | Gabriela + Pedro | Microscopia/Laudo e Painel da Coordenação | Médico Residente, Patologista/Preceptor, Citotécnico, Coordenação/Admin | `microscopia`, `laudo`, `painel`, `admin` |

**Por que essa divisão:**

- A **Recepção** é o módulo mais adiantado, então a Dupla A já começa com código de exemplo para estudar.
- A **Macroscopia** e o **Processamento** são telas de registro por etapa, que seguem o mesmo padrão de formulário e lista de trabalho. É um bom terreno para aprender.
- **Microscopia/Laudo** tem as regras mais delicadas: aprovação do patologista, conclusão do caso e permissões. Por isso fica com a dupla mais experiente.

A divisão pode ser revista em retrospectiva se algum módulo ficar pesado demais.

### 2.2. Áreas compartilhadas

Algumas partes do código são usadas por todas as duplas. Mudanças nelas precisam de **revisão de alguém de outra dupla** (ver a seção 9.2):

- `frontend/src/components/`: componentes base (`DataTable`, `Modal`, `Button`, etc.)
- `frontend/src/types/ap.ts` e `frontend/src/services/ap/types.ts`: domínio e contratos dos serviços
- `frontend/src/layouts/`, `frontend/src/router/` e `frontend/src/index.css`
- `src/auth/`, `src/resources/`, `src/helpers/`, `src/main.py` e `alembic/`
- `docs/especificacao/`, `openspec/specs/` e `AGENTS.md`

---

## 3. Revezamento semanal

Dentro de cada dupla, uma pessoa **coda** e a outra **valida** em cada semana. Na semana seguinte, os papéis trocam. Assim ninguém fica sobrecarregado e todo mundo passa pelos dois lados.

### 3.1. Papéis

|  | 🛠️ **Codador(a)** da semana | 🔍 **Revisor(a)** da semana |
| --- | --- | --- |
| **Foco** | Implementar | Garantir qualidade e aderência à especificação |
| **Faz** | Pega as issues da dupla, escreve o código, abre PRs e responde ao review. É o *driver* nas sessões de pair. | Revisa as propostas OpenSpec e os PRs da dupla, roda o código localmente, valida contra os critérios de aceitação de `02-requisitos.md`, testa casos de borda e erro e mantém as issues da dupla atualizadas (descrição, critérios, rótulos). É o *navigator* nas sessões de pair. |
| **Não faz** | Não faz merge do próprio PR sem aprovação | Não abre PR de funcionalidade. Pode sugerir trechos de código no review (*suggestion*). |
| **Prazo** | Responder aos comentários em até **1 dia útil** | Primeiro review em até **1 dia útil** depois que o PR sai de rascunho |

O papel de revisor também é trabalho de aprendizado: ler código bem escrito e entender a especificação a fundo faz quem está começando evoluir rápido.

### 3.2. Calendário

A semana do revezamento vai de **quarta a terça**, e os papéis trocam toda **quarta-feira**. Na primeira semana, as referências codam e as iniciantes revisam. Assim as iniciantes começam entendendo o código e o fluxo antes de assumir o teclado.

| Semana | Período | Dupla A codando | Dupla B codando | Dupla C codando |
| --- | --- | --- | --- | --- |
| 1 | 11/11 a 17/11 | Pessoa 1 | Pessoa 3 | Pessoa 5 |
| 2 | 18/11 a 24/11 | Pessoa 2 | Pessoa 4 | Pessoa 6 |
| 3 | 25/11 a 01/12 | Pessoa 1 | Pessoa 3 | Pessoa 5 |
| 4 | 02/12 a 08/12 | Pessoa 2 | Pessoa 4 | Pessoa 6 |
| 5 | 09/12 a 15/12 | Pessoa 1 | Pessoa 3 | Pessoa 5 |
| 6 | 16/12 a 22/12 | Pessoa 2 | Pessoa 4 | Pessoa 6 |

Quem não estiver codando é o(a) revisor(a) da dupla naquela semana. Semanas com feriado ou prova podem ser negociadas no grupo com antecedência.

### 3.3. Passagem de bastão (toda quarta)

Na troca de papéis, a dupla faz uma conversa rápida de 15 minutos:

1. O que foi entregue na semana e o que ficou aberto (PRs, issues e changes OpenSpec).
2. Quem assume os PRs que ainda estão abertos. Em geral, o PR continua com quem abriu até o merge, mesmo depois da troca.
3. O que a pessoa que vai codar pega primeiro.

---

## 4. Pair programming

O revezamento define **quem tem o teclado** na semana. O pair programming garante que a dupla **trabalhe junta**.

- **Pelo menos 2 sessões por semana**, de 1h a 1h30, presenciais ou por chamada com compartilhamento de tela.
- **Driver:** o(a) codador(a) da semana. **Navigator:** o(a) revisor(a), que pensa no próximo passo, consulta a especificação, aponta problemas e faz perguntas.
- Nas semanas em que a **iniciante coda**, a referência navega sem pegar o teclado. Ela guia com perguntas ("o que você acha que essa função recebe?") em vez de ditar a solução.
- Termine cada sessão com uma anotação curta na issue: o que foi feito, o que ficou para depois e as dúvidas em aberto.

### 4.1. Apoio a quem está começando

- Issues com o rótulo **`boa-primeira-issue`** têm escopo pequeno e são reservadas para as iniciantes nas primeiras semanas.
- Nenhuma pergunta é boba. Uma pergunta feita no grupo ou no PR quase sempre ajuda mais alguém.
- Se estiver travada por mais de **30 minutos**, peça ajuda. Travar faz parte; passar o dia travada não precisa acontecer.

---

## 5. Fluxo de trabalho

```
Issue → (Change OpenSpec) → Branch → Commits → PR em rascunho → PR pronto → Review → Merge
```

1. **Issue.** Todo trabalho começa numa issue, com rótulo da dupla (`dupla-a`, `dupla-b`, `dupla-c`), tipo (`feature`, `bug`, `docs`) e referência aos requisitos (ex.: `RF006`).
2. **Change OpenSpec**, para funcionalidades novas ou mudanças de comportamento. Crie a proposta em `openspec/changes/<nome-do-change>/` (`/opsx:propose`, se estiver usando o Claude Code). O(a) revisor(a) da semana **revisa a proposta antes de a implementação começar**. Ajustes visuais e bugs pequenos dispensam o change.
3. **Branch** a partir da base correta (ver a seção 6).
4. **Commits** pequenos, seguindo a seção 7.
5. **PR em rascunho** cedo, para a dupla acompanhar. Quando estiver pronto, marque como *Ready for review*.
6. **Review**, com aprovação conforme a seção 9.
7. **Merge** por quem abriu o PR, depois da aprovação e com a verificação passando. Arquive o change OpenSpec quando ele estiver concluído (`/opsx:archive`).

---

## 6. Branches

- **`master`** é a branch estável. Ninguém faz commit direto nela; tudo entra por PR.
- Formato do nome: `tipo/escopo-descricao-curta`, em minúsculas, com hífens:

```
feat/recepcao-integracao-csv
fix/macroscopia-validacao-fragmentos
docs/contributing
refactor/componentes-datatable
```

- **Base:** `master`. Enquanto `feat/initial-reception-flow` não entrar na `master`, os trabalhos que dependem dela partem dessa branch.
- Branches curtas: tente abrir o PR em até **3 dias**. Atualize a sua branch com a base com frequência (`git pull --rebase origin master`).

---

## 7. Commits

Usamos **Conventional Commits**, com a mensagem **em português** e no presente:

```
tipo(escopo): descrição curta no imperativo/presente
```

| Tipo | Quando usar |
| --- | --- |
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação e especificação (inclui OpenSpec) |
| `style` | Ajuste visual ou de formatação, sem mudança de lógica |
| `refactor` | Mudança de código sem mudança de comportamento |
| `test` | Testes |
| `chore` | Dependências, configuração e ferramentas |

**Escopos:** o nome do módulo (`recepcao`, `devolucoes`, `caso`, `macroscopia`, `processamento`, `ihq`, `microscopia`, `laudo`, `arquivo`, `painel`, `admin`) ou da área (`componentes`, `layout`, `backend`, `auth`, `openspec`).

Exemplos reais do repositório:

```
feat(recepcao): fila de pendentes, urgência da congelação e retorno pelo menu
fix(auditoria): corrige NameError no audit_framework.py ao colorir a saída
docs(openspec): arquiva o change fix-reception-flow-feedback
```

Se o pair foi feito em conjunto, dê crédito no final do commit:

```
Co-authored-by: Nome <email@exemplo.com>
```

---

## 8. Pull Requests

- Use o **template** em `.github/pull_request_template.md`. Ele já é carregado automaticamente ao abrir o PR. Preencha todas as seções e marque o checklist com honestidade.
- **Título** no mesmo formato dos commits: `feat(recepcao): integra fila de pendentes com o CSV do HC`.
- **Tamanho:** procure ficar abaixo de ~400 linhas alteradas, sem contar lockfiles e arquivos gerados. PR grande deve ser dividido.
- **Um assunto por PR.** Refatoração que surgiu no caminho vai em outro PR.
- **Evidências:** prints ou GIFs da tela, sempre com **dados fictícios** (ver a seção 10).
- **Merge:** use *Squash and merge*, com o título do PR como mensagem.

---

## 9. Code review

### 9.1. O que olhar

- **Especificação:** o comportamento bate com os requisitos e cenários de `docs/especificacao/` e com as specs do OpenSpec?
- **Arquitetura:** respeita Roteador → Controller → Provedor? As views usam apenas os serviços de `services/ap/` e não acessam mocks ou a API diretamente?
- **Segurança:** as rotas novas estão protegidas? Mutações de dados clínicos registram auditoria? Não há segredo no código?
- **Interface:** reaproveita componentes existentes e o tema *Paper*? Tem estados de carregamento, vazio e erro?
- **Legibilidade:** nomes claros, funções pequenas e comentários só onde o *porquê* não é óbvio.
- **Rodou de verdade:** baixe a branch, rode e teste o fluxo, incluindo pelo menos um caminho de erro.

### 9.2. Quem revisa

| Tipo de mudança | Aprovação necessária |
| --- | --- |
| Código só do módulo da dupla | 1 aprovação do(a) **revisor(a) da dupla** |
| Mexe em área compartilhada | Revisor(a) da dupla **+ 1 revisor(a) de outra dupla** |
| Especificação ou decisão de arquitetura (ADR) | Revisor(a) da dupla **+ 1 de cada uma das outras duplas** |

Os revisores da semana das três duplas formam um "pool". Para pedir revisão cruzada, chame alguém desse pool.

### 9.3. Como comentar

Use um prefixo para deixar clara a intenção de cada comentário:

| Prefixo | Significado |
| --- | --- |
| **`[bloqueante]`** | Precisa ser resolvido antes do merge |
| **`[sugestão]`** | Melhoria recomendada; quem abriu o PR decide |
| **`[dúvida]`** | Pergunta para entender; não exige mudança |
| **`[detalhe]`** | Pequeno ajuste opcional (nome, formatação) |
| **`[elogio]`** | Algo que ficou bom 💜 |

Comente o **código**, não a pessoa. Explique o *porquê* e, quando possível, sugira o trecho. Em PRs das iniciantes, prefira perguntas que levem à solução a respostas prontas.

---

## 10. Dados de pacientes e LGPD

> ⚠️ **Este repositório é público.** Dado real de paciente **nunca** entra no Git.
> 
- O **CSV de solicitações disponibilizado pelo HC** já vem **anonimizado** e pode ser usado livremente no desenvolvimento local. Até o HC autorizar por escrito a publicação dele num repositório público, ele **fica fora do Git**: cada pessoa guarda o arquivo numa pasta ignorada pelo Git (`data/privado/`), e ele é lido por um caminho configurado no `.env`.
- Mocks, seeds, testes, prints e GIFs usam **somente dados fictícios**.
- Antes de cada commit, confira o `git status` e o `git diff --staged`.
- Se um dado real for commitado por engano, **avise o time imediatamente**. Não basta apagar o arquivo num commit novo: ele continua no histórico e precisa ser removido de lá.
- O CSV não pode ser compartilhado fora da equipe nem enviado a serviços externos, inclusive ferramentas de IA de uso pessoal.

---

## 11. Uso de IA

O projeto tem diretrizes para agentes de IA em `AGENTS.md` e comandos do OpenSpec em `.claude/`. Ao usar IA:

- Código gerado por IA passa pelo **mesmo review** que qualquer outro código. Quem abre o PR responde por ele e precisa saber explicá-lo.
- Agentes **não fazem commit nem push** sem pedido explícito de uma pessoa do time.
- Para quem está aprendendo: use a IA para **entender** (pedir explicações, revisar o seu raciocínio, achar o erro), não para pular a parte em que você aprende. Nas sessões de pair, quem dirige é a pessoa, não a IA.
- Nunca cole dados reais de pacientes em ferramentas de IA (ver a seção 10).

---

## 12. Definição de pronto

Uma tarefa está **pronta** quando:

- [ ]  Atende aos critérios de aceitação da issue e da especificação
- [ ]  `python audit_framework.py .` dá 100%, `npx vue-tsc --noEmit` passa sem erros e `uv run pytest` passa (se mexeu no backend)
- [ ]  Foi validada localmente pelo(a) revisor(a), incluindo pelo menos um caminho de erro
- [ ]  O PR foi aprovado conforme a seção 9.2, com os comentários `[bloqueante]` resolvidos
- [ ]  O change OpenSpec está com as tarefas marcadas e foi arquivado, se for o caso
- [ ]  A documentação foi atualizada, se o comportamento mudou

---

Dúvidas sobre este guia? Abra uma issue com o rótulo `docs` ou fale no grupo. Este documento também passa por PR e review. 💜
