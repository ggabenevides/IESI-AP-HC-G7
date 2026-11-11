# nonconformity-return Specification

## Requirements

### Requirement: Autorização de registro e atualização existentes

O registro de não conformidade/devolução e a atualização de situação SHALL exigir permissões explícitas da matriz SAP/HC validada. O backend SHALL aplicar as verificações tanto na criação quanto na atualização.

#### Scenario: Atualização direta sem permissão

- **WHEN** usuário sem permissão chama diretamente a operação de atualização da situação
- **THEN** o backend responde 403 e não altera a situação nem registra mutação
