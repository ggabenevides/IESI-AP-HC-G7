# **SISTEMA DE GESTÃO INTEGRADA DE SERVIÇOS DE ANATOMIA PATOLÓGICA** — Documento de Validação e Especificação de Negócio

> **Padrão Oficial SETISD / HC-UFPE (HU Brasil) — Fase 0 (Alinhamento de Negócio)**  
> **Público-alvo:** Profissionais das áreas envolvidas ao setor de anatomia patológica do HC e sua Equipe de TI.  
> **Objetivo:** Descrever o processo de trabalho em **linguagem pura de negócio** (sem jargões técnicos de programação ou banco de dados) para validação, alinhamento de expectativas e tomada de decisão antes de qualquer codificação.

## **1\. Identificação do Projeto e Contexto Institucional**

| Campo | Descrição |
| :---- | :---- |
| **Nome do Sistema** | Sistema de Gestão Integrada de Serviços de Anatomia Patológica. |
| **Área Solicitante / Cliente** | Serviço de Anatomia Patológica \- HC UFPE |
| **Instância Superior Competente** | Gerência de Atenção à Saúde |
| **Líder Técnico (SETISD)** | Daniel Turmina  |
| **Objetivo Estratégico HU Brasil** | OE14, OE18 |

## **2\. O Problema que Queremos Resolver**

> **Objetivo:** Desenvolver uma solução de gestão para o setor de Anatomia Patológica que centralize o acompanhamento dos processos, reduza controles manuais e retrabalho, melhore a rastreabilidade dos casos e organize a integração das informações hoje distribuídas entre AGHU, planilhas e registros físicos.  
> 

* **A Dor Central:**  
  As informações e o acompanhamento dos casos na Anatomia Patológica estão distribuídos entre AGHU, planilhas e registros físicos, o que gera retrabalho, duplicidade de informações, dificuldade de rastreabilidade e maior risco de atrasos ou falhas no acompanhamento dos processos.  
    
    
* **Por que isso não pode continuar (Impactos Reais):**

  * **Retrabalho e Sobrecarga Operacional:** A equipe precisa registrar, consultar e atualizar informações em diferentes meios, como AGHU, planilhas e documentos físicos, repetindo tarefas e aumentando o tempo gasto em atividades administrativas.

  * **Baixa Rastreabilidade dos Casos:** Não há uma visão única e atualizada do andamento de cada exame, dificultando saber onde o material está, quem foi o último responsável, quais etapas já foram concluídas e quais ainda estão pendentes.

  * **Risco de Atrasos e Falhas de Informação:** Registros manuais ou não atualizados podem fazer com que solicitações de recorte, coloração, IHQ ou outras pendências não sejam acompanhadas adequadamente, aumentando o risco de atrasos no diagnóstico.

  * **Dificuldade de Gestão e Identificação de Gargalos:** A ausência de dados centralizados dificulta acompanhar tempos de processamento, volume de casos, pendências e desempenho das etapas, limitando a capacidade da gestão de identificar gargalos e tomar decisões com base em indicadores.

## **3\. Como o Processo Funciona Hoje (A Rotina Atual)**

> **Objetivo:** Mapear a realidade crua de como as equipes se viram no dia a dia para realizar essa tarefa hoje.  
> 

* **Meios Utilizados Hoje:**  
  Planilhas Teams comuns ao setor, sistema AGHU, papel impresso físico, livro de protocolo, etiquetas impressas, trocas de e-mail, ligações telefônicas.  
    
* **A Rotina Prática de Trabalho:**

1. **Recepção:**  
1. Criação de nova planilha Teams utilizada ao longo do ano corrente.  
2. **Preenchimento:**  
   1. Recebimento e conferência de amostras das Unidades Assistenciais e externas, e dos Blocos Cirúrgicos.  
      1. Devolução de amostras fora das competência da análise patológica.  
   2. Impressão da ficha de trabalho.  
   3. Cadastramento das amostras na planilha Teams e, se externas, no AGHU.  
      1. Conferência de pedidos de congelação ou de urgência.  
      2. Transferência das informações presentes no AGHU ou na solicitação para a planilha interna de forma manual.  
      3. Contato direto com o setor/médico solicitante se necessário.  
      4. Alternância constante entre planilhas e páginas do AGHU.  
      5. Suscetibilidade a erros de digitação ou de decifragem de caligrafia.  
   4. Conferência da natureza da solicitação, geração de cassetes e encaminhamento da amostra para o respectivo setor.  
   5. Assinatura do livro de protocolo com o número da amostra e o profissional responsável por seu recebimento e encaminhamento.  
3. **Processamento técnico:**  
   1. Encaminhamento da amostra para o setor técnico responsável.  
   2. Realização dos procedimentos técnicos requeridos.  
   3. Atualização da planilha Teams.  
4. **Microscopia:**  
   1. Elaboração de laudo prévio pelos residentes.  
   2. Atualização da planilha Teams.  
   3. Revisão do laudo por médico.  
      1. Possível solicitação complementar de imuno-histoquímico, recoloração, nova laminação, etc. – retorno ao processamento técnico e nova atualização da planilha Teams.  
      2. Possível necessidade de discussão do laudo.  
   4. Fechamento do laudo.  
   5. Registro do laudo e liberação de resultados no AGHU.  
   6. Atualização da planilha Teams com liberação.  
      1. Ocasional preenchimento incompleto ou inconsistência de dados da planilha no decorrer do fluxo.  
5. **Arquivamento.**  
   1. Arquivamento da amostra pelo período de 5 a 10 anos.

## **4\. O que a nova solução deve entregar (Resultado esperado)**

> **Objetivo:** Definir com clareza o que a solução digital deve trazer para eliminar a dor do processo atual.  
>   
**A Proposta de Valor:** Centralizar a gestão dos processos da Anatomia Patológica em um único sistema, aproveitando dados disponíveis no AGHU, registrando movimentações e responsáveis ao longo de cada etapa e permitindo acompanhar, de forma simples e atualizada, a situação de cada caso desde a entrada do material até sua conclusão. 

**Ganhos Práticos Imediatos:**

* Redução da necessidade de redigitação de informações já existentes no AGHU.  
  * Substituição de grande parte dos controles hoje distribuídos em planilhas, livros e pranchetas.  
  * Rastreabilidade das amostras, com registro de onde o material está, por quais etapas passou, quem/quando realizou cada movimentação, etc. 

## **5\. Como Será o Trabalho no Novo Sistema (O Novo Fluxo)**

**Objetivo:** Explicar em linguagem direta como o usuário vai interagir com o sistema, resolvendo a dor do processo manual de ponta a ponta.  
> 

1. **Os dados já vêm prontos:** O usuário não precisa mais recadastrar pessoas, setores ou cargos do zero. Ao abrir a tela, a lista oficial da sua equipe e local de trabalho já está carregada.

2. **Preenchimento rápido com travas contra erros:** O responsável digita ou seleciona as informações direto na tela. Se tentar lançar dados conflitantes (ex: duplicidade de horários ou campos obrigatórios em branco), o próprio sistema avisa antes de salvar.

3. **Aprovação com um clique:** Concluída a digitação, a chefia confere tudo em uma tela unificada e aprova eletronicamente. O sistema registra automaticamente quem aprovou, data e hora, travando contra alterações indevidas.

4. **Informação pronta e disponível:** A gestão acompanha em tempo real um painel mostrando quem já entregou e quem está pendente. A versão oficial homologada fica acessível para consulta imediata de quem tem direito, sem necessidade de procurar papéis ou cobrar por telefone.

5. **Preenchimento obrigatório:** Campos faltantes ou não preenchidos são expostos e alertados para evitar acompanhamentos e registros incompletos. Isso garante que todas as amostras sejam registradas e seu histórico possa ser acessado.

6. **Exibição de insights valiosos:** Gráficos e métricas visuais serão exibidas para melhor acompanhamento de resultados, processos e fluxos, permitindo maior controle e gestão do setor para tomada de decisões.

## **6\. Quem Participa do Processo (Atores: Como Faz Hoje vs. Como Fará no Sistema)**

| Ator / Perfil no Hospital | O que faz HOJE (Rotina Manual) | O que passará a fazer no NOVO SISTEMA | O que NÃO poderá fazer |
| :---- | :---- | :---- | :---- |
| **Recepção do Setor de Anatomia Patológica**  | Recebe amostras no sistema AGHU e copia informações para planilha interna. | Escanear código de barras da etiqueta da amostra e acessar dados extraídos do AGHU já formatados no sistema para conferência e eventual complemento. | Não acessar diretamente o AGHU e nem preencher dados de etapas futuras.  |
| **Setores: Recepção, Macroscopia, Congelação, Processamento Técnico, IHQ, Microscopia e Arquivo.** | Protocola todas as fases do material em um caderno. Uma espécie de ficha física. | Rastreabilidade do material nos setores através Sistema desenvolvido. | Não haverá necessidade de um caderno físico. |
| **Setor de macroscopia** | Digita manualmente textos padrões sobre materiais. | Possuirá máscaras prontas para os tipos comuns, mas com possibilidade de edição. | Não ter que digitar o texto inteiro. |
| **Recepção** | Acessa a descrição do material biológico em uma página separada do AGHU. | Introduzirá a descrição do material juntamente com as demais informações da solicitação. | Não haverá necessidade de abrir mais de uma tela para ver a descrição do material. |

## **7\. Regras de Negócio Inegociáveis (RNs)**

* RN-01 (Acesso Individual): O acesso ao sistema é feito exclusivamente por meio de credenciais de uso pessoal e intransferível. Não são permitidos usuários compartilhados ou genéricos. Cada ação realizada no sistema fica vinculada ao usuário que a executou.  
* RN-02 (Rastreabilidade das Ações): Toda alteração, aprovação e exclusão de dados de pacientes fica registrada com autor, data e hora. Esses registros não podem ser alterados nem apagados por nenhum usuário, inclusive gestores, e são mantidos pelo prazo definido pela instituição, para fins de auditoria.  
* RN-03 (Permissões por Perfil): Cada usuário só pode executar as ações permitidas ao seu perfil. A atribuição, alteração e retirada de perfis é feita exclusivamente por acesso de perfil administrador, mediante solicitação formal do Chefe de Unidade.  
* RN-04 (Integridade e Unicidade dos Registros): Não pode existir registro em duplicidade ou registros incompletos. Um registro só é considerado concluído quando todos os campos obrigatórios estiverem preenchidos. Registros incompletos permanecem como rascunho e não são tidos como concluídos.  
* RN-05 (Proteção de Dados de Pacientes): Por se tratar de dados pessoais sensíveis, os dados de pacientes só podem ser acessados por profissionais vinculados ao setor de Anatomia Patológica e apenas no escopo das suas atividades. Nenhuma informação que identifique pacientes é exibida em consultas públicas, painéis gerenciais ou relatórios.

## **8\. Painel de Gestão e Indicadores Estratégicos (KPIs)**

O sistema deve disponibilizar painel gerencial hierárquico (cada chefia enxerga o seu escopo) com os seguintes indicadores de negócio:

1. **Taxa de retrabalho:** Acompanhamento percentual e quantitativo em tempo real de quais análises, laudos e registros precisaram ser refeitos ou corrigidos após a primeira execução, identificando os pontos de origem do problema e reduzindo o desperdício de tempo e recursos da equipe.

2. **Tempo médio por etapa:** Monitoramento contínuo do tempo gasto em cada fase do fluxo de trabalho, do recebimento da amostra à emissão do resultado, permitindo identificar gargalos e redistribuir a carga entre os setores sem depender de levantamentos manuais.

3. **Taxa de laudos dentro do prazo:** Acompanhamento percentual e quantitativo em tempo real de quantos laudos foram emitidos dentro do prazo acordado, mostrando quais setores e responsáveis estão em dia e evitando a necessidade de cobranças manuais.

4. **Taxa de não conformidades:** Medição percentual das ocorrências de desvios em relação aos padrões e procedimentos estabelecidos, classificadas por tipo, setor e etapa, o que facilita ações corretivas rápidas e a melhoria contínua dos processos.

5. **Tempo médio até liberação do laudo:** Cálculo automático do intervalo entre a entrada da amostra e a liberação final do laudo, oferecendo uma visão clara da eficiência do fluxo completo e do cumprimento dos prazos prometidos aos clientes.

6. **Taxa de amostras com não conformidades:** Acompanhamento percentual e quantitativo das amostras que apresentaram alguma irregularidade, como identificação incorreta, condições inadequadas de coleta ou armazenamento, apontando a origem dos problemas.

7. **Taxa Média de completude dos registros:** Verificação em tempo real do quanto os registros estão totalmente preenchidos e com todos os campos obrigatórios, garantindo a rastreabilidade, reduzindo pendências e eliminando a necessidade de revisões manuais posteriores.

## **9\. Matriz de Pontos de Decisão (Gabinete / Gestão do Negócio)**

> *Itens que dependem de confirmação dos gestores do hospital antes da conclusão:*

| \# | Ponto a Decidir | Impacto no Processo | Quem deve decidir? | Status / Definição |
| :---- | :---- | :---- | :---- | :---- |
| **1** | **Substituição completa da ficha:** é necessário manter o uso da ficha que circula pelo departamento? | Define se a solução final deve cobrir os registros dos avanços das amostras pelo setor. | Chefe de Unidade | Em aberto |
| **2** | **Data Limite Oficial:** Até qual dia do período os setores devem fechar o preenchimento e assinar? | Define a regra do sistema para disparar alertas preventivos e travar edições intempestivas. | Chefe de Unidade  | Em aberto |
| **3** | **Edição pós-Homologação:** Qual deve ser o protocolo formal para reabrir e corrigir dados já registrados? | Define o protocolo de alteração de dados na solução final. | Chefe de Unidade | Em aberto |

# ---

# 📘 GUIA METODOLÓGICO: COMO ESTE DOCUMENTO SE INTERLIGA AOS DEMAIS ARQUIVOS DO PROJETO

> **Apresentação Executiva para a Chefia:**  
> Esta seção explica a lógica de engenharia e governança adotada pelo SETISD para conectar as necessidades de negócio da ponta à construção do software.

### A Linha do Tempo: A Separação entre "Fase de Negócio" e "Fase de Engenharia"

Em qualquer projeto de software hospitalar existem dois mundos que precisam se comunicar com perfeição:

1. **O Mundo do Negócio (Chefias, Áreas Solicitantes, Governança, Direção):** Não devem ser expostos a termos técnicos de TI (bancos de dados, endpoints, JSON, status HTTP, docker, etc.). Eles precisam discutir *processos, dores reais, prazos, responsabilidades e regras*.  
2. **O Mundo da Engenharia (Desenvolvedores e Testes):** Precisam de tabelas relacionais, tipos de dados estritos, rotas de API seguras e casos de uso testáveis.

Este documento (`00-validacao-negocio.md`) funciona como a **Ponte Oficial** entre esses dois mundos:

               ┌────────────────────────────────────────────────────────┐

               │      00-VALIDAÇÃO E FLUXO DE NEGÓCIO (ESTE ARQUIVO)    │     

               │   Linguagem humana, fluxos e regras reais de negócio.  │        FASE 1

               │   Validado e assinado pelas Chefias e Direção do HC.   │       (Negócio)

               └───────────────────────────┬────────────────────────────┘

                                           │

                 ┌─────────────────────────┴─────────────────────────┐

                 ▼ (Uma vez aprovado, a TI desdobra tecnicamente)     ▼

               ┌────────────────────────────────────────────────────────┐

               │            ARTEFATOS DE ESPECIFICAÇÃO TÉCNICA          │

               │   01-visao.md  →  02-requisitos.md  →  03-casos-uso.md │        FASE 2

               │   04-modelo-dados.md  →  05-interfaces  →  SPEC.md     │     (Engenharia)

               └────────────────────────────────────────────────────────┘

---

### Como cada seção deste documento alimenta a documentação técnica:

| Seção deste Documento de Negócio | O que ela entrega para a documentação técnica? | Arquivo de Destino |
| :---- | :---- | :---- |
| **Seção 2 (O Problema que Queremos Resolver)** | Define a motivação institucional, os riscos do modelo atual e a justificativa do projeto. | [01-visao.md](http://01-visao.md) *(Problema e Escopo)* |
| **Seção 3 (Como o Processo Funciona Hoje)** | Serve de base para mapear os processos manuais que serão substituídos e os dados legados. | [01-visao.md](http://01-visao.md) *(Cenário Atual)* |
| **Seção 4 (O Que a Nova Solução Deve Entregar)** | Define os objetivos do produto e os ganhos práticos que orientam a entrega de valor. | [01-visao.md](http://01-visao.md) *(Visão de Futuro)* |
| **Seção 5 (Como Será o Trabalho no Novo Sistema)** | Detalha as etapas práticas do usuário na tela, que viram os fluxos e cenários de uso do sistema. | [02-requisitos.md](http://02-requisitos.md) e [03-casos-uso.md](http://03-casos-uso.md) *(Casos de Uso e Fluxos)* |
| **Seção 6 (Quem Participa do Processo)** | Define os perfis de acesso, permissões de cada papel e o modelo de autorização local. | [02-requisitos.md](http://02-requisitos.md) e [03-casos-uso.md](http://03-casos-uso.md) *(Atores e RBAC)* |
| **Seção 7 (Regras de Negócio Inegociáveis)** | É convertida diretamente em requisitos funcionais estritos e validações de backend. | [02-requisitos.md](http://02-requisitos.md) *(Requisitos Funcionais \- RFs)* |
| **Seção 8 (Painel de Gestão e Indicadores)** | Dá origem às consultas analíticas de acompanhamento, relatórios e telas gerenciais. | [05-interfaces.md](http://05-interfaces.md) *(Protótipos e Dashboards)* |
| **Seção 9 (Matriz de Pontos de Decisão)** | Orienta os parâmetros de configuração e regras que alimentam as tarefas de implementação. | [SPEC.md](http://SPEC.md) *(Definições e Tarefas)* |

---

### A Regra de Ouro do Processo no SETISD:

1. **Início do Projeto (Fase de Negócio):** O profissional de TI preenche este documento junto com os responsáveis pela área de negócio em reuniões de alinhamento, validando o problema real, os fluxos práticos e as decisões pendentes.  
2. **Desenvolvimento (Fase de Engenharia):** Com este documento aprovado pelas partes envolvidas, a equipe de desenvolvimento tem total clareza técnica para elaborar os artefatos de `01` a `06` e programar a solução com segurança e sem retrabalho.

**Resultado:** O cliente hospitalar participa ativamente sem ser sobrecarregado com termos técnicos, e a equipe de TI constrói exatamente o que o hospital precisa.  
