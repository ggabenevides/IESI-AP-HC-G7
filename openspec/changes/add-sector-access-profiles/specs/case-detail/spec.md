# case-detail Specification

## Requirements

### Requirement: Autorização de consulta e cancelamento existentes

A consulta de detalhe e a operação existente de cancelamento SHALL exigir permissões explícitas distintas quando a matriz validada assim determinar. O frontend SHALL refletir as permissões, e o backend SHALL aplicá-las em chamadas diretas.

#### Scenario: Cancelamento sem permissão

- **WHEN** usuário sem permissão de cancelamento tenta cancelar um caso diretamente
- **THEN** o backend responde 403 e mantém caso, histórico e materiais sem alteração
