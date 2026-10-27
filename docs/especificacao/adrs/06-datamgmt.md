# Estratégia de dados do framework: provedores intercambiáveis com seleção explícita de fonte por domínio

* Status: aceita (registro retrospectivo)
* Data do registro: 2026-10-13

> **Nota:** esta ADR documenta retroativamente uma decisão já incorporada ao framework. Ela foi reconstruída a partir da análise da arquitetura existente (`architecture.md` e estrutura do repositório), e não de um registro da discussão original. As alternativas listadas são as que a própria estrutura do código permite inferir como descartadas; podem não coincidir exatamente com as que o time avaliou na época.

## Contexto e descrição do problema

O framework serve de base para o desenvolvimento de sistemas do hospital, incluindo o módulo de Anatomia Patológica do HC. Esses sistemas precisam lidar com fontes de dados de naturezas distintas:

* **Dados corporativos do hospital**, mantidos no AGHU (PostgreSQL): leitos, prontuários, faturamento e pacientes. São a fonte oficial de produção e só podem ser consultados com acesso à rede do hospital.
* **Dados nativos do novo sistema**: estados locais, sessões, perfis de acesso (RBAC) e tabelas próprias de cada módulo.
* **Ambiente de desenvolvimento**, que frequentemente não tem acesso à rede do hospital.

O problema era como organizar o acesso a dados de modo que (1) a lógica de negócio não dependesse da fonte concreta, (2) fosse possível desenvolver e testar sem acesso ao banco corporativo, (3) a fonte usada por cada domínio fosse fácil de identificar e (4) recursos como pools de conexão só fossem consumidos quando realmente necessários.

## Opções consideradas

* Padrão de Provedor com seleção de estratégia por roteador (interfaces, implementações e fábrica de dependências)
* Acesso direto ao PostgreSQL do AGHU a partir dos controllers, sem camada de abstração
* Banco único, persistindo também os dados nativos no PostgreSQL corporativo
* Seleção da fonte de dados por variável de ambiente global, válida para toda a aplicação

## Consequências

Opção escolhida: "Padrão de Provedor com seleção de estratégia por roteador", porque foi a que melhor atendeu aos quatro requisitos do contexto: isola a lógica de negócio da fonte de dados, viabiliza o desenvolvimento offline, torna explícita a fonte de cada domínio e evita inicializar conexões desnecessárias.

A decisão se materializou nos seguintes elementos:

1. **Três papéis de armazenamento**
   * **SQLite interno (`APP_DB_URL`):** banco padrão da aplicação, para estados locais, sessões e tabelas nativas do novo sistema.
   * **PostgreSQL corporativo (`POSTGRES_DSN`):** fonte oficial de produção, usada para consultar dados do AGHU.
   * **CSV (`data/pacientes.csv`):** provedor secundário para desenvolvimento local sem acesso à rede do hospital.
2. **Arquitetura em camadas com fluxo unidirecional `Roteador -> Controller -> Provedor`:**
   * O roteador (`src/routers/`) define os endpoints, valida entradas com Pydantic e resolve dependências via `Depends`.
   * O controller (`src/controllers/`) concentra a lógica de negócio e conhece apenas a interface do provedor.
   * O provedor (`src/providers/`) é a única camada que sabe como acessar uma fonte específica.
3. **Contrato por domínio:** cada domínio possui uma interface em `src/providers/interfaces/` (ex.: `PacienteProviderInterface`) e uma ou mais implementações em `src/providers/implementations/` (ex.: `PacientePostgresProvider`, `PacienteCsvProvider`).
4. **Fábrica de dependências (`src/dependencies.py`):** funções como `get_paciente_provider` recebem uma string de estratégia (`"postgres"` ou `"csv"`) e retornam a função de dependência correta para o FastAPI, de modo que a conexão com o PostgreSQL só é tentada quando a estratégia `"postgres"` é selecionada.
5. **Ponto único de configuração no roteador:** a estratégia é definida por uma constante no próprio arquivo do roteador (ex.: `STRATEGY = "csv"` em `src/routers/paciente.py`), tornando
