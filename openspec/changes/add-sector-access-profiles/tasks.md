# Tasks

## 1. Confirmar política e contratos

- [ ] 1.1 Consolidar a matriz preliminar papel × operação a partir dos casos de uso e validar concessões de Recepção com SAP/HC; registrar como pendentes/negadas as células sem confirmação, especialmente Citotécnico.
- [ ] 1.2 Definir catálogo de permissões estáveis para consulta, execução, alteração e aprovação; documentar permissões reservadas a módulos futuros sem atribuí-las.
- [ ] 1.3 Definir configuração de provedor de identidade e regra de falha de inicialização do mock em produção.

## 2. Identidade e autorização no backend

- [ ] 2.1 Refatorar o provedor atual atrás do contrato de Adapter, normalizando identidade e preservando JWT/refresh existentes sem dependência de protocolo institucional.
- [ ] 2.2 Implementar catálogo dos nove perfis, resolução de múltiplos perfis e permissões explícitas com 401/403 e negação por padrão.
- [ ] 2.3 Expor identidade/perfis/permissões efetivos em `/api/users/me`; retirar decisões de autorização baseadas em grupos AD.
- [ ] 2.4 Criar identidades mock fictícias por perfil e sem perfil, selecionáveis apenas em desenvolvimento/testes; impedir seleção arbitrária e uso em produção.
- [ ] 2.5 Proteger endpoints existentes e as operações de Recepção que forem expostas no backend; usar dependências por router/operação e nunca confiar em ocultação de UI.
- [ ] 2.6 Registrar autor autenticado e auditoria em mutações usando o helper existente; não aceitar autor do cliente.

## 3. Recepção e frontend

- [ ] 3.1 Migrar os serviços mock de Recepção para implementação HTTP mantendo os contratos de serviço e os fluxos existentes.
- [ ] 3.2 Atualizar Pinia para identidade e permissões; adicionar guards de permissão às rotas e ocultar ações/menu indisponíveis.
- [ ] 3.3 Tratar respostas 401/403 em navegação e mutações sem apresentar sucesso falso; preservar interceptadores Axios.
- [ ] 3.4 Confirmar que nenhuma tela, endpoint ou permissão operacional de módulo futuro foi introduzida.

## 4. Verificação

- [ ] 4.1 Testar autenticação mock para cada identidade, ausência de perfil, múltiplos perfis, seleção inválida e bloqueio do mock em produção.
- [ ] 4.2 Testar permissões positivas e negativas no backend, incluindo chamada direta aos endpoints de Recepção e acesso sem token.
- [ ] 4.3 Testar perfil alterado/removido no acesso seguinte, autoria e conteúdo de auditoria das mutações.
- [ ] 4.4 Verificar UI por papel e que botões ocultos não substituem enforcement do backend.
- [ ] 4.5 Rodar `npx vue-tsc --noEmit` (frontend/) e `python audit_framework.py .`; registrar resultados e limitações.

## Acceptance Criteria

- Os nove identificadores de perfil existem, sem acesso funcional fictício a módulos não implementados.
- O servidor concede somente permissões explícitas da matriz ratificada; perfil ausente ou operação sem concessão é negado.
- Usuário mock pode ser trocado em ambiente de desenvolvimento/testes e mock não inicia em produção.
- A camada de negócio depende da identidade normalizada, não do protocolo ou dos grupos do provedor.
- Operações da Recepção protegidas recusam chamadas diretas sem permissão; a interface reflete os mesmos direitos.
- Mutação auditável identifica o usuário autenticado e não permite forjar o autor via requisição.
- Nenhum protocolo institucional é escolhido ou implementado nesta mudança.
