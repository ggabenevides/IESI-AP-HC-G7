# Tasks

## 1. Confirmar política e contratos

- [ ] 1.1 Consolidar a matriz preliminar papel × operação a partir dos casos de uso e validar concessões de Recepção com SAP/HC; registrar como pendentes/negadas as células sem confirmação, especialmente Citotécnico.
- [x] 1.2 Definir catálogo inicial de permissões estáveis e manter sem concessão operações sem associação explícita nos casos de uso.
- [x] 1.3 Configurar o Adapter mock explicitamente e bloquear seu uso em produção.

## 2. Identidade e autorização no backend

- [x] 2.1 Refatorar o provedor atual atrás do contrato de Adapter, normalizando identidade e preservando JWT/refresh existentes sem dependência de protocolo institucional.
- [x] 2.2 Implementar catálogo dos nove perfis, resolução de múltiplos perfis e permissões explícitas com 401/403 e negação por padrão.
- [x] 2.3 Expor identidade/perfis/permissões efetivos em `/api/users/me`; remover autorização por grupos do provedor.
- [x] 2.4 Criar identidades mock fictícias por perfil e sem perfil, selecionáveis apenas em desenvolvimento/testes; impedir seleção arbitrária e uso em produção.
- [ ] 2.5 Proteger endpoints existentes e as operações de Recepção que forem expostas no backend; usar dependências por router/operação e nunca confiar em ocultação de UI.
- [ ] 2.6 Registrar autor autenticado e auditoria em mutações usando o helper existente; não aceitar autor do cliente.

## 3. Recepção e frontend

- [ ] 3.1 Migrar os serviços mock de Recepção para implementação HTTP mantendo os contratos de serviço e os fluxos existentes.
- [ ] 3.2 Atualizar Pinia para identidade e permissões; adicionar guards de permissão às rotas e ocultar ações/menu indisponíveis.
- [ ] 3.3 Tratar respostas 401/403 em navegação e mutações sem apresentar sucesso falso; preservar interceptadores Axios.
- [ ] 3.4 Confirmar que nenhuma tela, endpoint ou permissão operacional de módulo futuro foi introduzida.

## 4. Verificação

- [x] 4.1 Testar catálogo de nove perfis, usuário sem perfil, múltiplos perfis, credenciais inválidas e bloqueio do mock em produção.
- [ ] 4.2 Testar permissões positivas e negativas no backend, incluindo chamada direta aos endpoints de Recepção e acesso sem token.
- [ ] 4.3 Testar perfil alterado/removido no acesso seguinte, autoria e conteúdo de auditoria das mutações.
- [ ] 4.4 Verificar UI por papel e que botões ocultos não substituem enforcement do backend.
- [x] 4.5 Rodar `npx.cmd vue-tsc --noEmit` (frontend/) e `python audit_framework.py .`; TypeScript passou e o auditor reportou 10/11 (90,9%), com a lacuna do RBAC persistido híbrido detalhada abaixo.

## Acceptance Criteria

- Os nove identificadores de perfil existem, sem acesso funcional fictício a módulos não implementados.
- O servidor concede somente permissões explícitas da matriz ratificada; perfil ausente ou operação sem concessão é negado.
- Usuário mock pode ser trocado em ambiente de desenvolvimento/testes e mock não inicia em produção.
- A camada de negócio depende da identidade normalizada, não do protocolo ou dos grupos do provedor.
- Operações da Recepção protegidas recusam chamadas diretas sem permissão; a interface reflete os mesmos direitos.
- Mutação auditável identifica o usuário autenticado e não permite forjar o autor via requisição.
- Nenhum protocolo institucional é escolhido ou implementado nesta mudança.

## Pendências para concluir o change

- [ ] Migrar as operações existentes de Recepção dos serviços em memória do navegador para endpoints FastAPI que recebam e persistam a operação no servidor; proteger cada endpoint com a permissão correspondente e registrar autoria/auditoria. Até lá, o frontend mock não é uma barreira de segurança para estado local e o fluxo não está pronto para produção.
- [ ] Validar a matriz papel × operação com SAP/HC e ratificar todas as concessões de Recepção; manter as células ainda ambíguas negadas.
- [ ] Definir uma fonte persistente e governada para associação de perfis locais, se exigida para produção; não habilitar gestão por administrador local de desenvolvimento.
