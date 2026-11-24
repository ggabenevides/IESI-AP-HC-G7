# Microscopia: roteiro de desenvolvimento

Este roteiro organiza o início do desenvolvimento na branch `feat/microscopia`.
É um plano de trabalho, não uma nova especificação nem uma alteração das regras
existentes. Antes de implementar, consulte o [contrato SPEC](../especificacao/SPEC.md)
e os documentos vinculados. Não utilizar dados reais de pacientes no desenvolvimento.

## Escopo desta frente

A dupla também é responsável por Laudo e Painel de Coordenação, mas o trabalho
desta branch está limitado à **aba de Microscopia** e às suas dependências
diretas. Laudo e Painel de Coordenação serão tratados separadamente. Recepção,
Arquivo, Macroscopia, Processamento Técnico, IHQ e gestão de usuários pertencem
às outras duplas: alinhar contratos e integrações com elas, sem desenvolver ou
alterar suas funcionalidades nesta frente.

Os perfis de interesse são Médico Residente, Patologista/Preceptor,
Citotécnico e Coordenação/Administrador. O acesso solicitado para
Coordenação/Administrador é total no sistema, com a exceção de que **somente
o Médico Patologista/Preceptor pode liberar o laudo**. A aplicação atual não
concede todas as permissões à Coordenação/Administrador. O alcance das demais
ações clínicas e o acesso a dados e painéis gerenciais permanecem pendentes de
validação antes de alterar o RBAC compartilhado.

## 1. Contexto e limites

O Sistema AP acompanha o caso e suas movimentações; não substitui o AGHU.
Na rotina descrita, o residente elabora um parecer, o patologista/preceptor
revisa e decide entre solicitar complementos ou fechar o diagnóstico. A
liberação oficial do laudo permanece uma ação manual no AGHU, realizada somente
pelo Médico Patologista/Preceptor; no Sistema AP, registra-se apenas a
confirmação dessa liberação. A confirmação no Sistema AP é uma ação distinta,
cuja permissão ainda deve ser definida. Complementos podem devolver o caso à
macroscopia, ao processamento ou à IHQ, preservando o histórico.

**Fontes de referência:**

- [Fluxo e regras de negócio](../especificacao/00-validacao-negocio.md), seções 3 e 7.
- [Requisitos](../especificacao/02-requisitos.md), especialmente CARE-RF005, 007,
  010, 012, 014, 015, 017 e 025.
- [Casos de uso](../especificacao/03-casos-uso.md): UC016–017 e UC020–023.
- [Modelo de dados](../especificacao/04-modelo-dados.md), seções 2.2, 2.7, 2.8,
  3.6 e 3.7.
- [Arquitetura](../ARCHITECTURE.md), [guia de desenvolvimento](../GUIA_DESENVOLVIMENTO.md),
  [auditoria](../AUDITORIA_E_LOGS.md) e [configuração](../SETUP.md).

**Atenção à rastreabilidade:** a numeração de RF na matriz de
`03-casos-uso.md` não coincide com a tabela e os CARE de `02-requisitos.md`.
O roteiro usa os IDs do último documento e os números de UC separadamente.
Há também divergência entre a tabela de RF025, que menciona aprovação pelo
residente, e CARE-RF015/017, que atribuem aprovação ao patologista/preceptor.
Confirmar com o SAP antes de implementar o fluxo de aprovação e emissão;
não corrigir a especificação por conta própria.

## 2. Ponto de partida do repositório

- A Recepção possui casos e histórico persistidos em SQLite:
  [modelos](../../src/models/ap_reception.py), [rotas](../../src/routers/reception.py),
  [controller](../../src/controllers/reception_controller.py) e
  [provider](../../src/providers/implementations/reception_sqlite_provider.py).
  Os modelos atuais usam `ap_casos` e `payload`; o modelo lógico da
  especificação usa outras entidades, como `caso_ap` e `caso_etapa`.
  Mapear essa diferença antes de propor migrações, sem criar um segundo caso
  incompatível ou substituir os dados existentes.
- A consulta e o detalhe já existem em
  [ConsultaCasos.vue](../../frontend/src/views/ap/ConsultaCasos.vue) e
  [DetalheCaso.vue](../../frontend/src/views/ap/DetalheCaso.vue). Reutilizar os
  serviços, componentes e contratos existentes; tipos e telas existentes não
  demonstram, por si só, que o fluxo de microscopia esteja implementado.
- [Autorização](../../src/auth/authorization.py) já define os perfis de residente,
  patologista/preceptor e citotécnico, mas ainda não define permissões
  específicas de microscopia. O perfil citotécnico tem ações futuras pendentes
  de validação pelo SAP.
- A aplicação usa HTTP por padrão no frontend; o mock local é explícito e
  restrito ao desenvolvimento, conforme [serviços AP](../../frontend/src/services/ap/index.ts).
  Para solicitações AP, o backend atual aceita somente provedor mock em
  desenvolvimento/teste; o provedor institucional ainda não está implementado
  ([configuração](../../src/config.py)). Não presumir integração operacional em
  produção nem criar uma integração de escrita no AGHU.

## 3. Preparar o ambiente local

Siga os pré-requisitos e orientações completas do [setup](../SETUP.md). Exemplo no
PowerShell, a partir da raiz do projeto:

1. Confirme a branch com `git branch --show-current`.
2. Crie `.env` a partir de `.env.example` **somente se ainda não existir**.
   Configure-o para desenvolvimento local com autenticação e solicitações mock,
   conforme o exemplo. Não use credenciais reais nem copie o DSN de exemplo
   como conexão funcional; deixe `POSTGRES_DSN` vazio quando não houver acesso
   autorizado. Não sobrescreva configurações pessoais existentes.
3. Instale as dependências previstas no projeto com `uv sync` e, em
   `frontend`, `npm ci`. Consulte o setup para os pré-requisitos.
4. Em terminais separados, execute:

   ```powershell
   # Raiz do repositório
   uv run uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
   ```

   ```powershell
   # Raiz do repositório, em outro terminal
   Set-Location frontend
   npm run dev
   ```

5. Acesse `http://localhost:5173` e `http://localhost:8000/docs`. Confira
   login mock, consulta de casos e detalhes usando apenas dados fictícios.
   `AP_REQUEST_FIXTURE=demo` carrega exemplos de demonstração no backend;
   não confundir esse mock com o mock local do frontend.

O script `dev.sh` é destinado a Bash e encerra processos `uvicorn` e `vite`
por padrão de nome; em ambiente compartilhado, prefira os comandos individuais
acima e encerre apenas os processos iniciados para seu trabalho.

### 3.1. Usuários e senha provisórios para desenvolvimento

A autenticação institucional está em desenvolvimento em outra branch. Nesta
branch, estes acessos são identidades **fictícias do provedor mock**, válidas
apenas em `development`, `test` ou `testing` com `AUTH_PROVIDER=mock`. Não são
contas institucionais, não devem ser usados em produção ou com dados reais e
podem mudar quando o trabalho de autenticação for integrado.

Todos os usuários abaixo usam a senha fictícia de desenvolvimento **`demo`**:

| Usuário | Perfil inicial | Utilização relacionada à microscopia |
|---|---|---|
| `residente` | `MEDICO_RESIDENTE` | Consultar casos como residente. |
| `patologista` | `PATOLOGISTA_PRECEPTOR` | Consultar casos como patologista/preceptor. |
| `citotecnico` | `CITOTECNICO` | Consultar casos; ações específicas aguardam validação. |
| `admin` | `COORDENACAO_ADMINISTRADOR` | Consultar casos; o acesso total solicitado ainda não está implementado. |
| `sem-perfil` | Nenhum | Verificar que uma identidade sem permissão não acessa os casos. |

Para entrar, inicie backend e frontend conforme a seção 3, abra
`http://localhost:5173/login`, escolha a identidade fictícia e informe `demo`.
Os quatro perfis da tabela recebem inicialmente a permissão `casos:consultar`;
essa permissão permite abrir **Consulta de microscopia** e os detalhes já
disponíveis. A lista é somente leitura, mas o detalhe mantém as ações existentes
permitidas para cada perfil. Registro, revisão e aprovação de parecer de
microscopia ainda não estão implementados.

O mock cadastra usuários e perfis no banco local na inicialização, sem
sobrescrever cadastros existentes. Portanto, alterações prévias de perfil ou
usuário inativo podem modificar ou impedir o acesso; confira o cadastro local
com a equipe responsável sem apagar dados. Para demais identidades mock e
detalhes de autorização, consulte [Autenticação](../AUTHENTICATION.md) e o
[catálogo de perfis](../../src/auth/authorization.py). Nunca registre senhas
reais, tokens ou segredos nesta documentação.

### 3.2. Abrir a Microscopia no navegador

1. Prepare o ambiente da seção 3 e mantenha os dois terminais em execução:
   backend na porta `8000` e frontend Vite na porta `5173`.
2. No navegador, abra `http://localhost:5173/login` e entre com uma das
   identidades fictícias da seção 3.1.
3. No menu lateral, selecione **Consulta de microscopia** ou acesse
   `http://localhost:5173/microscopia`.
4. A lista mostra casos com status **Em microscopia** ou **Aguardando
   aprovação**. Use os filtros de busca, tipo, período e urgência; selecione
   um caso para consultar o detalhe e o histórico existentes. A lista não
   confirma elegibilidade clínica.
5. Se a lista estiver vazia, confira se `AP_REQUEST_PROVIDER=mock` e
   `AP_REQUEST_FIXTURE=demo` estão configurados no backend de desenvolvimento.
   Se houver erro de conexão, confira os dois terminais e tente novamente.
   Use somente dados fictícios.
6. Ao terminar, pressione `Ctrl+C` em cada terminal iniciado para encerrar
   os servidores de desenvolvimento.

Para consultar a documentação interativa da API, abra
`http://localhost:8000/docs`; ela não substitui a interface no navegador.

## 4. Decisões e dependências antes de codificar

Registrar as respostas com a equipe do SAP e a equipe técnica, sem tratar
hipóteses como regras aprovadas:

1. Quais tipos de exame entram primeiro na microscopia, quais condições de
   entrada/retorno se aplicam a cada um e quem registra o recebimento?
2. Quais campos são obrigatórios para salvar, enviar para revisão, aprovar e
   concluir? Como identificar residente e patologista responsáveis? O rascunho
   incompleto deve permanecer recuperável e não pode avançar o caso.
3. Qual é a matriz de ações de residente, patologista/preceptor e citotécnico?
   Confirmar a divergência de aprovação citada acima e o papel do citotécnico.
   A liberação do laudo é exclusiva do Patologista/Preceptor; o alcance das
   demais ações da Coordenação/Administrador deve ser reconciliado com as
   restrições de aprovação e conclusão e com as regras de acesso a dados e
   painéis gerenciais.
4. Quais complementos e dados são necessários na primeira entrega? Como
   acompanhar a execução e o retorno quando as demais etapas ainda não estão
   disponíveis? Não simular execução nem conclusão de outras equipes.
5. Como tratar correções após conclusão, registros versionados e eventual
   reabertura? A edição pós-homologação está em aberto no documento de negócio.
6. Quem confirma a liberação manual no AGHU e quais informações são necessárias
   para o documento imprimível? Confirmar fluxo de máscaras e seu uso na
   microscopia: a tabela RF014 menciona microscopia, mas seu CARE detalha
   principalmente macroscopia.
7. Mapear o caso e histórico persistidos hoje ao modelo especificado, bem como
   a forma de identificar a passagem por etapa e garantir concorrência. Validar
   migração e integração com as equipes responsáveis pelas etapas adjacentes.

Até essas definições, desenvolver apenas fatias cujos critérios estejam claros;
não inventar permissões, campos clínicos ou transições.

## 5. Sequência sugerida de implementação

Cada entrega deve incluir backend, interface quando necessária e testes, sem
alterar o comportamento existente de Recepção.

### Etapa 1 — Consulta e entrada no contexto do caso

- [ ] Revisar os contratos atuais de listagem, detalhe e histórico; identificar
  os dados realmente persistidos e os que dependem de outras etapas.
- [ ] Com a elegibilidade validada, disponibilizar a consulta de casos aptos à
  microscopia e o acesso ao contexto e histórico já existentes, com destaque
  para urgência e sem expor dados a perfis não autorizados.
- [ ] Testar acesso autorizado e negado, caso inexistente, elegibilidade e
  preservação das consultas da Recepção.

### Etapa 2 — Parecer preliminar e revisão

- [ ] Mapear `registro_diagnostico` e `caso_etapa` da especificação ao esquema
  atual. Criar os modelos e migração Alembic necessários após alinhamento,
  preservando dados e referências existentes.
- [ ] Criar contrato de provider, implementação local, schemas Pydantic,
  controller e rotas autenticadas, seguindo o padrão existente. Implementar
  permissões explícitas no backend para cada ação aprovada.
- [ ] Permitir rascunho recuperável e envio para revisão somente com campos
  obrigatórios completos. Identificar autor pela sessão e registrar data/hora,
  histórico e auditoria; não aceitar responsável indicado pelo cliente.
- [ ] Reutilizar o detalhe do caso e os serviços HTTP para apresentar o
  contexto, o parecer e os erros de validação. Permitir ao patologista revisar,
  aprovar ou devolver com observações, conforme decisão validada.
- [ ] Testar rascunho incompleto, recuperação, envio válido, papéis, devolução,
  aprovação, acesso direto à API e concorrência entre alterações.

### Etapa 3 — Complementos e retorno

- [ ] Registrar pedido vinculado ao caso, com tipo, justificativa, detalhamento,
  solicitante, data e destino, conforme a especificação e as regras validadas.
  Registrar evento próprio, sem sobrescrever a execução original.
- [ ] Integrar o acompanhamento com a etapa executora quando disponível;
  após o resultado, permitir retorno à microscopia. IHQ é complemento do caso,
  e sua conclusão técnica não encerra o diagnóstico.
- [ ] Testar pedidos distintos, histórico, permissões, retorno e impossibilidade
  de apresentar execução ou resultado inexistente como concluído.

### Integração posterior com Laudo

- [ ] Alinhar com a frente de Laudo o contrato para entrega do parecer revisado,
  sem implementar conclusão, liberação no AGHU ou impressão nesta branch.
  Comunicar a regra de liberação exclusiva pelo Patologista/Preceptor e validar
  separadamente a permissão para confirmar no Sistema AP a liberação no AGHU.
- [ ] Planejar máscaras para Microscopia após validação do conteúdo e das
  permissões. Alterações na máscara não devem modificar textos já salvos.
- [ ] Preservar versões e motivo de correções diagnósticas, conforme o modelo e
  a decisão sobre correção e reabertura.

## 6. Critérios transversais e verificação

- Proteger rotas no `APIRouter` e aplicar autorização por ação no servidor.
  Não confiar apenas em botões ocultos na interface.
- Executar cada mutação clínica, atualização de estado, histórico e auditoria
  de modo consistente, com usuário da sessão, data/hora, IP disponível e
  estados anterior/novo. O histórico de caso não substitui `audit_logs`.
- Respeitar o modelo de dados, proibição de exclusão física, proteção dos dados
  sensíveis e a exigência de AES-256 do SPEC; validar com a equipe a solução
  institucional antes de persistir dados sensíveis. Não adicionar dependências
  fora da arquitetura documentada.
- Utilizar dados fictícios nos testes. Incluir testes de segurança, ordem das
  etapas, erro explícito, concorrência, transações e regressão da Recepção.
- Após implementar, executar os testes pertinentes e o build do frontend:

  ```powershell
  uv run pytest tests/test_reception_api.py tests/test_sector_access_profiles.py
  # Acrescentar nesta execução os arquivos de teste da funcionalidade criada.
  Set-Location frontend
  npm run build
  Set-Location ..
  python audit_framework.py .
  ```

  Executar também a suíte completa com `uv run pytest` antes da entrega quando
  necessário. O auditor é obrigatório após implementação/refatoração; verificar
  os 11 pilares e a taxa de conformidade exigida. Se um comando falhar, registrar
  a saída e resolver ou comunicar o bloqueio, sem declarar a entrega validada.

## 7. Primeira tarefa recomendada

Reunir SAP e desenvolvimento para validar a **entrada na microscopia e o
parecer preliminar** (itens 1–3 da seção 4), mapear os dados reais já
persistidos e definir critérios de aceite. Em seguida, implementar a primeira
fatia de consulta e rascunho em ambiente fictício; aprovação, complementos e
conclusão ficam condicionados às decisões e dependências correspondentes.
