/**
 * "Banco" em memória do mock do Sistema AP.
 *
 * Usado apenas pelas implementações mock dos serviços (`services/ap/mock`). Os dados voltam à
 * carga inicial ao recarregar a página.
 */
import type { SolicitacaoAghu } from '../../types/ap';
import { criarCargaInicial, type MockDb } from './seed';

export let db: MockDb = criarCargaInicial(new Date());

/** Última carga de solicitações vinda do backend (modo híbrido), para reaplicar no reinício. */
let solicitacoesExternas: SolicitacaoAghu[] | null = null;

/**
 * Substitui as solicitações AGUARDANDO_RECEBIMENTO do banco pelas vindas do backend.
 *
 * Mantém as RECEBIDA e DEVOLVIDA já existentes (as do seed, ligadas a casos e devoluções do mock,
 * e as do backend já recebidas/devolvidas nesta sessão) e não reinsere como pendente uma
 * solicitação cujo código já esteja no banco.
 */
export function aplicarSolicitacoesExternas(lista: SolicitacaoAghu[]): void {
  solicitacoesExternas = structuredClone(lista);
  const mantidas = db.solicitacoes.filter((s) => s.situacaoRecepcao !== 'AGUARDANDO_RECEBIMENTO');
  const codigos = new Set(mantidas.map((s) => s.codigoSolicitacao));
  const novas = structuredClone(lista).filter((s) => !codigos.has(s.codigoSolicitacao));
  db.solicitacoes = [...mantidas, ...novas];
}

/** Recria a carga inicial e reaplica a última carga do backend, se houver. */
export function reiniciarDb(): void {
  db = criarCargaInicial(new Date());
  if (solicitacoesExternas) aplicarSolicitacoesExternas(solicitacoesExternas);
}

/** Próximo identificador numérico da sequência informada. */
export function proximoId(sequencia: keyof MockDb['sequencias']): number {
  db.sequencias[sequencia] += 1;
  return db.sequencias[sequencia];
}

/** Simula indisponibilidade (ou retorno) do AGHU. */
export function definirAghuDisponivel(disponivel: boolean): void {
  db.aghuDisponivel = disponivel;
}
