# case-search Specification

## Requirements

### Requirement: Autorização da consulta de casos existente

A consulta de casos e seus dados SHALL exigir permissão explícita de consulta. A associação de perfis à consulta SHALL seguir a matriz SAP/HC validada e SHALL NOT ser inferida apenas da existência do perfil.

#### Scenario: Consulta sem permissão

- **WHEN** usuário sem permissão de consulta solicita diretamente dados de casos
- **THEN** o backend responde 403 sem retornar dados do caso
