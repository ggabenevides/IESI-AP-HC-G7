# Especificação de Requisitos

## 1. Requisitos Funcionais (RF)
| ID | Título | Descrição | Prioridade |
| :--- | :--- | :--- | :---: |
| RF001 | Autenticação | Login via credenciais do hospital. | Essencial |
| RF002 | Importação de dados | Importar dados de novos pacientes/casos do AGHU diretamente para o sistema de AP. | Essencial |
| RF003 | Rastreabilidade de casos | Localizar e consultar casos e acompanhar histórico. | Essencial |
| RF004 | Geração de ID interno | Atribuir um ID interno único a casos/amostras importadas do AGHU. | Essencial |
| RF005 | Consulta por ID | Consultar amostras por código de barras/qrcode. | Essencial |
| RF006 | Completude dos registros | Impedir conclusão de registro até que todos os campos sejam preenchidos, mantendo-os como rascunhos. | Essencial |
| RF007 | Recebimento de amostras | Permitir que o usuário confira os dados da solicitação e da amostra e confirme o seu recebimento no setor. | Essencial |
| RF008 | Registro de solicitações complementares | Registrar etapas complementares (IHQ, recoloração, relaminação) como eventos próprios na movimentação para medir retrabalho | Importante |
| RF009 | Impressão de etiqueta | Gerar e imprimir uma etiqueta de identificação da interna da amostra. | Essencial |
| RF010 | Gerência de permissões/visualização por perfil | Administrador atribui perfis de acordo com responsabilidades do usuário para garantir integridade de dados e simplicidade da interface | Importante |
| RF011 | Registro das etapas | Registrar o andamento da amostra nas diferentes etapas do diagnóstico. | Essencial |
| RF012 | Controle de urgências | Permitir identificar e filtrar casos classificados como urgentes. | Essencial |
| RF013 | Rastreabilidade da amostra | Guardar informações sobre a data e responsável por cada etapa.| Essencial |
| RF014 | Painel gerencial de KPIs | Visualização de painel de KPIs sem dados identicáveis dos pacientes para perfil gerencial. | Desejável |
| RF015 | Máscaras de texto padrão | Oferecer máscaras de texto editáveis para macroscopia | Importante |
| RF016 | Registro de conclusão do caso | Permitir realizar a conclusão do caso e armazenamento do laudo/responsável | Essencial |
| RF017 | Controle de IHQ externa | Registrar encaminhamentos de exames para o laboratório externo e acompanhar o andamento. | Essencial |
| RF018 | Visualização unificada de resultados | Administrador/residente tem acesso a tela com informações registradas para aprovação de maneira rápida e simples. | Importante |
| RF019 | Geração de ficha de trabalho | Gerar e imprimir uma ficha contendo os dados relativos ao caso para acompanhamento físico. | Desejável |
| RF020 | Registro de materiais produzidos | Registrar informações sobre recortes, cassetes, blocos e lâminas produzidos durante o processamento do caso. | Essencial |
| RF021 | Registro de não conformidades | Permitir registrar divergências de identificação, quantidade, integridade ou condições das amostras recebidas. | Essencial |
| RF022 | Controle de devolução e cancelamento | Registrar devoluções, cancelamentos e seus respectivos motivos, responsáveis e históricos. | Importante |
| RF023 | Alertas de estagnação | Destacar caso/emitir alertas quando um caso permanecer em uma etapa por mais tempo do que o esperado. | Desejável |
| RF024 | Controle de pendências | Identificar casos com etapas pendentes, indicando o que falta para permitir sua continuidade. | Essencial |
| RF025 | Painel de processos em andamentos | Gestão visualiza andamento de processos em tempo real em painel informando etapa atual, tempo desde o início do processamento, etc. | Importante |
| RF026 | Geração de documento de laudo para impressão | Após aprovação do residente, é gerado um arquivo formatado do laudo pronto para impressão. | Desejável |
| RF027 | XXXXXXXX | XXXXXXXXXXXXXX | XXXXXXXXXXX |

### 📌 Legenda de Níveis de Prioridade:
- **Essencial (Alta):** Funcionalidade indispensável para o funcionamento básico da aplicação. Sem ela, o sistema não pode ir para produção (ex: autenticação, cadastros base).
- **Importante (Média):** Funcionalidade que agrega valor significativo ao negócio e melhora o fluxo de trabalho, mas cuja ausência temporária não impede a operação mínima (ex: relatórios, filtros avançados).
- **Desejável (Baixa):** Funcionalidade complementar, melhoria estética ou recurso secundário que pode ser implementado em sprints futuras (ex: temas visuais, atalhos de teclado).

## 2. Requisitos Não Funcionais (RNF)
| ID | Categoria | Descrição |
| :--- | :--- | :--- |
| RNF001 | Criptografia | Tokens JWT assinados com HS256 e Cookies HttpOnly para Refresh Tokens. |
| RNF002 | LGPD / Auditoria | Trilha de auditoria obrigatória (antes/depois) em tabela `audit_logs` para mutações. |
| RNF003 | Segurança HTTP | Middleware de Security Headers (anti-cache `no-store`, `X-Frame-Options: DENY`, anti-XSS). |
| RNF004 | Governança de segredos | Proibição de hardcode e validação de env vars na inicialização (`src/config.py`). |
| RNF005 | Governança híbrida | Definição de ponto único de controle no modelo AD + RBAC. |
| RNF006 | Integridade de dados | Controle da manipulação de dados em acesso concorrente e estabelecimento de uma fonte de verdade. |
| RNF007 | Resiliência | Capacidade de operar ante eventual indisponibilidade do AGHU. |
| RNF008 | Usabilidade | Adequação ao fluxo de processos da unidade e à proficiência do usuários. |
| RNF009 | Desempenho | Consulta e cadastro em poucos segundos mesmo com uso simultâneo em todos os setores |
| RNF010 | Sincronização de dados | Atualização simultânea dos dados exibidos em acessos concomitantes distintos. |
| RNF011 | Manutenibilidade | Padronização, modularidade, documentação e testabilidade do código. |
| RNF012 | Confiabilidade | Back-up automatizado de dados em rotina. |
| RNF013 | Compatibilidade e integração | Interoperabilidade com tecnologias e plataformas utilizadas pela unidade. |

## 3. Detalhamento SDD (CARE)
Para cada requisito, a implementação deve seguir o padrão:

### [CARE-RF001] Autenticação 
* **Context (Contexto)**: O usuário possui credenciais institucionais válidas e precisa acessar o sistema de Anatomia Patológica.
* **Action (Ação)**: O usuário informa suas credenciais (que já usa em outras aplicações do hospital).
* **Result (Resultado)**: O sistema valida as credenciais e permite o acesso conforme o perfil e as permissões do usuário.
* **Evaluation (Avaliação)**: Verificar se usuários com credenciais válidas no banco de dados do hospital conseguem acessar o sistema com as mesmas credenciais.

### [CARE-RF002] Importação de dados
* **Context (Contexto)**: Existem novas solicitações ou casos de Anatomia Patológica cadastrados no AGHU.
* **Action (Ação)**: O sistema consulta os dados disponíveis no AGHU e importa as informações necessárias para o sistema interno.
* **Result (Resultado)**: Os novos casos aparecem no sistema interno com os dados importados do AGHU associados corretamente à respectiva solicitação.
* **Evaluation (Avaliação)**: Verificar se os dados de um caso existente são importados automaticamente e corretamentamente para o sistema interno.

### [CARE-RF003] Ratreabilidade de casos
* **Context (Contexto)**: O técnico/médico está autenticado no sistema e existem casos de anatomia patológica cadastrados no sistema.
* **Action (Ação)**: O médico consulta um caso de anatomia patológica a partir do nome, status ou outro atributo e o sistema busca por um caso com atributo correspondente.
* **Result (Resultado)**: O sistema retorna os casos correspondentes ao que foi consultado e eles são exibidos na interface.
* **Evaluation (Avaliação)**: Verificar se a busca de um caso acontece de maneira que os casos retornados possuem atributos correspondentes aos atributos inseridos na busca.

### [CARE-RF004] Geração de ID
* **Context (Contexto)**: Existem casos e amostras importados do AGHU que precisam ser identificados de maneira única no sistema de Anatomia Patológica, independentemente dos identificadores utilizados no sistema de origem.
* **Action (Ação)**: O usuário importa um novo caso ou amostra do AGHU, e o sistema gera e associa automaticamente um identificador interno único ao registro importado.
* **Result (Resultado)**: O sistema armazena o identificador gerado e o associa ao respectivo caso ou amostra, permitindo sua identificação e rastreabilidade ao longo do fluxo de anatomia patológica.
* **Evaluation (Avaliação)**: Verificar se cada caso ou amostra importado recebe um identificador interno único, não duplicado entre os registros, persistente após consultas e atualizações e corretamente associado ao registro correspondente.