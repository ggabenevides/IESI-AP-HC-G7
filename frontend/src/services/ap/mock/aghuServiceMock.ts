/**
 * Implementação mock da consulta de solicitações do AGHU.
 */
import { db } from '../../../mocks/ap/db';
import type { LeituraSolicitacao, SolicitacaoAghu } from '../../../types/ap';
import type { AghuService } from '../types';
import { aguardarCargaSolicitacoes } from '../http/cargaSolicitacoes';
import { copia, exigirAghuDisponivel, latencia, normalizarCodigo } from './util';

/**
 * Classifica uma solicitação para a recepção (pendente, recebida, devolvida ou inexistente).
 * Não verifica a disponibilidade do AGHU.
 */
export function classificarSolicitacao(codigo: string): LeituraSolicitacao {
  const alvo = normalizarCodigo(codigo);
  const solicitacao = db.solicitacoes.find((s) => s.codigoSolicitacao === alvo);
  if (!solicitacao) return classificarPorCodigoAghu(alvo);
  return classificarEncontrada(solicitacao);
}

/**
 * Leitura do código do AGHU sem a amostra (ex.: "1479377" em vez de "1479377-2"):
 * - uma amostra pendente: abre essa amostra;
 * - várias pendentes: pede para escolher a amostra;
 * - nenhuma pendente, mas a solicitação existe: classifica a primeira (recebida/devolvida).
 */
function classificarPorCodigoAghu(codigoAghu: string): LeituraSolicitacao {
  const amostras = db.solicitacoes.filter((s) => s.codigoSolicitacaoAghu === codigoAghu);
  if (amostras.length === 0) return { tipo: 'NAO_ENCONTRADA' };

  const pendentes = amostras.filter((s) => s.situacaoRecepcao === 'AGUARDANDO_RECEBIMENTO');
  if (pendentes.length === 1) return { tipo: 'PENDENTE', solicitacao: copia(pendentes[0]) };
  if (pendentes.length > 1) {
    return { tipo: 'MULTIPLAS_AMOSTRAS', codigoSolicitacaoAghu: codigoAghu, solicitacoes: copia(pendentes) };
  }
  return classificarEncontrada(amostras[0]);
}

/** Classifica uma solicitação existente pela situação na recepção. */
function classificarEncontrada(solicitacao: SolicitacaoAghu): LeituraSolicitacao {

  if (solicitacao.situacaoRecepcao === 'RECEBIDA') {
    return {
      tipo: 'RECEBIDA',
      solicitacao: copia(solicitacao),
      casoNumero: solicitacao.casoNumero ?? solicitacao.ihqCasoNumero ?? '',
    };
  }

  if (solicitacao.situacaoRecepcao === 'DEVOLVIDA') {
    const devolucao = db.devolucoes.find((d) => d.id === solicitacao.devolucaoId);
    const naoConformidade = db.naoConformidades.find((nc) => nc.id === devolucao?.naoConformidadeId);
    return {
      tipo: 'DEVOLVIDA',
      solicitacao: copia(solicitacao),
      devolvidaEm: devolucao?.devolvidaEm ?? '',
      tipoNaoConformidade: naoConformidade?.tipo ?? 'OUTRO',
    };
  }

  return { tipo: 'PENDENTE', solicitacao: copia(solicitacao) };
}

export const aghuServiceMock: AghuService = {
  async listarPendentes(): Promise<SolicitacaoAghu[]> {
    await aguardarCargaSolicitacoes();
    await latencia();
    exigirAghuDisponivel();
    const pendentes = db.solicitacoes
      .filter((s) => s.situacaoRecepcao === 'AGUARDANDO_RECEBIMENTO')
      .sort((a, b) => a.dataSolicitacao.localeCompare(b.dataSolicitacao));
    return copia(pendentes);
  },

  async contarPendentes(): Promise<number> {
    await aguardarCargaSolicitacoes();
    await latencia(50);
    return db.solicitacoes.filter((s) => s.situacaoRecepcao === 'AGUARDANDO_RECEBIMENTO').length;
  },

  async lerSolicitacao(codigo: string): Promise<LeituraSolicitacao> {
    await aguardarCargaSolicitacoes();
    await latencia();
    exigirAghuDisponivel();
    return classificarSolicitacao(codigo);
  },
};
