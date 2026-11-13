# Tasks

## 1. Confirmar contratos e decisões de acesso

- [x] 1.1 Mapear cada método de frontend/src/services/ap/types.ts para endpoint, payload, resposta e regra já existente nas specs e nos casos de uso.
- [x] 1.2 Reutilizar o catálogo e as dependências de add-sector-access-profiles; não adicionar usuários, sessões ou permissões locais à API.
- [x] 1.3 Manter negadas as operações sem permissão confirmada: vínculo IHQ, evento de impressão e atualização de situação de devolução; registrar as decisões SAP/HC necessárias.
- [ ] 1.4 Confirmar com SAP/HC a política de consulta de dados de solicitações recebidas/devolvidas e as permissões pendentes antes de habilitá-las.
- [x] 1.5 Conceder consulta de devoluções ao perfil Recepcionista SAP após validação SAP/HC; manter consulta separada de alteração de situação.

## 2. Persistência e provedores

- [x] 2.1 Definir modelos SQLAlchemy para o subconjunto de solicitação, caso, conferência, material inicial, vínculo IHQ, histórico, não conformidade e devolução alinhados ao modelo de dados existente.
- [x] 2.2 Criar migração Alembic, chaves estrangeiras, índices e restrições contra recebimento/vínculo duplicado e códigos internos repetidos.
- [x] 2.3 Criar interfaces de provider e implementação persistente no APP_DB para estado de domínio.
- [x] 2.4 Migrar fixture fictícia de solicitações para provedor de desenvolvimento/testes, com carga idempotente e opção de indisponibilidade simulada.
- [x] 2.5 Bloquear o uso do provedor fictício em produção e não configurar conexão AGHU nesta mudança.
- [x] 2.6 Garantir unicidade do número interno sob concorrência e atomicidade de gravação de domínio, histórico e auditoria.

## 3. Controllers, endpoints e segurança

- [x] 3.1 Implementar controllers para consultas e operações existentes sem alterar as regras funcionais.
- [x] 3.2 Implementar endpoints do catálogo de API documentado em design.md, com schemas Pydantic/aliases compatíveis com os tipos TypeScript.
- [x] 3.3 Proteger todas as rotas, inclusive GET, com identidade e exigir_permissao do catálogo central.
- [x] 3.4 Negar explicitamente operações pendentes, sem curinga de administrador e sem tratar consulta como autorização de mutação.
- [x] 3.5 Derivar autor do token, chamar o helper AuditLog com estados anterior/novo e IP do servidor e reverter estado se auditoria falhar.
- [x] 3.6 Preservar formato {"detail": "..."} e códigos de erro de autenticação, autorização, validação, conflito, inexistência e indisponibilidade do provider.

## 4. Adaptar serviços do frontend

- [x] 4.1 Criar implementações HTTP de AghuService, CasoService, NaoConformidadeService e AuditoriaService usando frontend/src/services/api.ts.
- [x] 4.2 Preservar assinaturas e retornos que stores e views usam, ignorando qualquer usuário enviado pelo cliente como autoria.
- [x] 4.3 Selecionar os serviços HTTP como origem normal em frontend/src/services/ap/index.ts e manter mocks somente em seleção explícita de teste/desenvolvimento isolado.
- [x] 4.4 Converter erros HTTP para ServiceError sem fallback silencioso, tratar 401/403 e refletir permissões nas ações já existentes.
- [ ] 4.5 Manter telas, componentes, rotas e impressão física no navegador; o backend registra apenas o evento de impressão.

## 5. Testes e critérios de aceite

- [x] 5.1 Testar todos os endpoints com token ausente, identidades mockadas de cada um dos nove perfis, identidade sem perfil e identidade com múltiplos perfis; verificar permissões pelo catálogo central, sem duplicar a matriz nos testes.
- [x] 5.2 Testar operações ainda pendentes como negadas, consulta de devoluções somente para perfis com devolucoes:consultar e garantir que o papel Citotécnico não receba permissões presumidas.
- [x] 5.3 Testar chamadas diretas à API, payload com autor forjado, validações, conflitos de estado, indisponibilidade do provider e erros {"detail": "..."}.
- [x] 5.4 Testar persistência entre sessões, seed idempotente, unicidade concorrente e rollback quando auditoria falha.
- [x] 5.5 Verificar logs de auditoria quanto a identidade, categoria, recurso, estados anterior/novo e IP, sem dados clínicos desnecessários.
- [x] 5.6 Verificar integração das stores/views sem sucesso falso e que nenhuma operação dos módulos futuros foi introduzida.
- [ ] 5.7 Na conclusão da implementação, executar as verificações de arquitetura e frontend exigidas por AGENTS.md e openspec/config.yaml.

## Pendências de validação

- 1.4 permanece pendente da confirmação SAP/HC sobre a consulta de solicitações recebidas/devolvidas e as permissões para vínculo IHQ, impressão e alteração da situação de devoluções. A consulta de devoluções pelo perfil Recepcionista SAP foi validada e habilitada; alteração de situação segue negada no backend.
- 4.5 permanece pendente junto à autorização de impressão: os controles foram suprimidos enquanto a permissão estiver sem definição. Após decisão SAP/HC, manter a geração física no navegador e registrar o evento no backend sob permissão explícita.
- 5.7: `npx vue-tsc --noEmit` foi aprovado. `python audit_framework.py .` executou e reportou 10/11; o único pilar reprovado exige integração híbrida AD + RBAC, incompatível com o escopo desta mudança, que proíbe implementar autenticação institucional. `npm run build` também não concluiu porque o esbuild recebeu acesso negado ao diretório pai no ambiente de execução.
