# sample-reception Specification

## Requirements

### Requirement: Autorização de operações existentes da Recepção

Operações já disponíveis de recebimento, conferência, impressão, consulta, registro de não conformidade/devolução e atualização da situação SHALL exigir a permissão correspondente da matriz SAP/HC validada. Operações ainda executadas somente no serviço mock do navegador SHALL ser encaminhadas a uma operação de servidor antes de serem consideradas protegidas. Esta mudança SHALL NOT criar fluxos de negócio novos.

#### Scenario: Operação autorizada

- **WHEN** usuário autenticado possui permissão explícita para uma operação existente da Recepção
- **THEN** o backend executa a operação e registra como ator a identidade autenticada

#### Scenario: Operação não autorizada por chamada direta

- **WHEN** usuário autenticado sem a permissão correspondente chama diretamente a operação da Recepção
- **THEN** o backend responde 403 sem executar a mutação

#### Scenario: Matriz não ratificada

- **WHEN** a permissão de um perfil para uma operação da Recepção ainda depende de validação SAP/HC
- **THEN** a operação permanece negada para esse perfil até a validação
