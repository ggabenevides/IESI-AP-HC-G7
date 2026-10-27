# ADR 03: Padrão de Provedores com Seleção de Estratégia

## Contexto e Problema

O framework precisa suportar diferentes fontes de dados, como CSV e PostgreSQL, para um mesmo domínio, mantendo a lógica de negócio independente da implementação de acesso aos dados. É necessário selecionar o provedor adequado de forma explícita, garantindo que recursos específicos, como conexões com o banco, sejam inicializados somente quando necessários. Como garantir essa flexibilidade sem comprometer o desacoplamento e a organização do sistema?

## Opções Consideradas

1. Interfaces por domínio com fábrica de dependências: definir contratos para cada domínio, implementar provedores específicos e selecioná-los por meio de uma fábrica integrada à injeção de dependências do FastAPI.

2. Instanciação direta: criar os provedores diretamente nos roteadores ou controladores, acoplando a seleção das implementações aos componentes da aplicação.

3. Provedor único com lógica condicional: concentrar o acesso a diferentes fontes de dados em uma implementação com condições específicas para cada estratégia.

4. Configuração global: selecionar uma única fonte de dados para toda a aplicação por meio de variáveis de ambiente ou configurações globais.

## Resultado da Decisão

Opção escolhida: Interfaces por domínio com fábrica de dependências, pois permite selecionar provedores explicitamente, preserva o desacoplamento da lógica de negócio e centraliza a resolução das implementações. A fábrica seleciona o provedor conforme a estratégia definida no roteador, permitindo que o FastAPI injete a dependência correspondente sem inicializar recursos de fontes não selecionadas.

## Consequências

Positivas, porque:

* Permite substituir ou adicionar provedores sem alterar a lógica de negócio, desde que respeitem o contrato definido.
* Facilita testes com implementações simuladas (mocks) e diferentes fontes de dados.
* Permite estratégias independentes por domínio e evita inicializar conexões desnecessárias.

Negativas, porque:

* Aumenta a quantidade de interfaces, implementações e abstrações.
* Exige tratamento de estratégias inválidas e manutenção da fábrica.
* A seleção definida diretamente nos roteadores pode dificultar a configuração de diferentes ambientes; além disso, o ciclo de vida das conexões precisa ser gerenciado adequadamente.
