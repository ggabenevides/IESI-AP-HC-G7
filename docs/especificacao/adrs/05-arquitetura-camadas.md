# Arquitetura em camadas
## Contexto e descrição do problema
O sistema lida com fontes diversas de dados, os quais possuem diferentes demandas, direcionamentos e responsabilidades.
É necessário comportar eventuais modificações e substituições na origem desses dados, sem prejuízo ao funcionamento das demais etapas do projeto.
Como garantir o desacoplamento entre os ambientes de operação, de forma que se obtenha um padrão claro, independente e unidirecional de negócio?
## Opções consideradas
* Arquitetura em camadas;
* Uso de ORM diretamente pelos _controllers_;
* Lógica de negócio e acesso a dados nos _routers_;
* Arquitetura hexagonal.
## Consequências da decisão
**Arquitetura em camadas:**
Distingue explicitamente os componentes do projeto e permite, em uma arquitetura de porte adequado ao sistema, o desacoplamento necessário para implementação, teste, operação, manutenção e versionamento com diferentes fontes de dados.
**Fluxo de requisição na aplicação:**
Roteador → Controller → Provedor
### Consequências
* Positiva, porque permite o desacoplamento das camadas que compõem o sistema.
* Positiva, porque facilita a auditabilidade e a reastrabilidade do acesso a dados.
* Positiva, porque comporta alterações nas fontes de dados e migrações de legado independentemente da lógica de negócio.
* Positiva, porque corrobora a realização de testes unitários.
* Positiva, porque gera um fluxo unidirecional com responsabilidades bem delimitadas.
* Negativa, porque não trata diretamente a interdependência entre camadas distintas.
* Negativa, porque pode exigir que uma operação trivial perpasse por múltiplas camadas.
