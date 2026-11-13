/**
 * Acesso HTTP às solicitações do AGHU expostas pelo backend (`GET /api/solicitacoes`).
 *
 * Usa o `api` de `services/api.ts`, preservando os interceptadores (token e refresh).
 */
import api from '../../api';
import { ORIGENS } from '../../../constants/ap';
import type { OrigemAtendimento, SolicitacaoAghu, TipoExame } from '../../../types/ap';

/** Fonte das solicitações exibidas na recepção. */
export type FonteSolicitacoes = 'api' | 'mock';

const LIMITE_PADRAO = 200;
const LIMITE_MAXIMO = 1000;

/** Registro como devolvido pelo backend (camelCase, campos podem vir nulos). */
export interface SolicitacaoApiDto {
  id: string;
  codigoSolicitacao: string;
  numeroAmostra: string;
  prontuario: string | null;
  nomePaciente: string | null;
  dataNascimento: string | null;
  sexo: 'Feminino' | 'Masculino' | null;
  origem: string | null;
  unidade: string | null;
  especialidade: string | null;
  nomeSolicitante: string | null;
  dataSolicitacao: string | null;
  siglaExame: string | null;
  nomeExame: string | null;
  tipoExameSugerido: TipoExame;
  descricaoMaterial: string | null;
  informacoesClinicas: string | null;
  statusAghuDescricao: string | null;
  situacaoRecepcao: string | null;
  codigoLab?: string | null;
  convenio?: string | null;
  codStatusItem?: string | null;
}

/** Fonte configurada em `VITE_AP_FONTE_SOLICITACOES` (padrão: mock). */
export function fonteSolicitacoes(): FonteSolicitacoes {
  return (import.meta.env.VITE_AP_FONTE_SOLICITACOES ?? '').trim().toLowerCase() === 'api' ? 'api' : 'mock';
}

/** Limite configurado em `VITE_AP_SOLICITACOES_LIMITE`, restrito a 1..1000. */
function limiteConfigurado(): number {
  const valor = Number.parseInt(import.meta.env.VITE_AP_SOLICITACOES_LIMITE ?? '', 10);
  if (!Number.isFinite(valor) || valor < 1) return LIMITE_PADRAO;
  return Math.min(valor, LIMITE_MAXIMO);
}

/** Origem reconhecida pelo SAP ou null (nula/desconhecida). */
function paraOrigem(origem: string | null): OrigemAtendimento | null {
  return origem && origem in ORIGENS ? (origem as OrigemAtendimento) : null;
}

/** Converte um registro do backend para `SolicitacaoAghu`. */
export function paraSolicitacaoAghu(dto: SolicitacaoApiDto): SolicitacaoAghu {
  return {
    // O id composto é a chave usada pela busca e pelo mock (código + amostra é único).
    codigoSolicitacao: dto.id,
    codigoSolicitacaoAghu: dto.codigoSolicitacao,
    numeroAmostra: dto.numeroAmostra,
    prontuario: dto.prontuario ?? '',
    nomePaciente: dto.nomePaciente ?? '',
    dataNascimento: dto.dataNascimento ?? '',
    sexo: dto.sexo ?? null,
    origem: paraOrigem(dto.origem),
    unidade: dto.unidade ?? '',
    especialidade: dto.especialidade ?? '',
    nomeSolicitante: dto.nomeSolicitante ?? null,
    dataSolicitacao: dto.dataSolicitacao ?? '',
    siglaExame: dto.siglaExame ?? '',
    nomeExame: dto.nomeExame ?? '',
    tipoExameSugerido: dto.tipoExameSugerido,
    descricaoMaterial: dto.descricaoMaterial ?? '',
    informacoesClinicas: dto.informacoesClinicas ?? '',
    statusAghuDescricao: dto.statusAghuDescricao ?? '',
    situacaoRecepcao: 'AGUARDANDO_RECEBIMENTO',
  };
}

/** Busca no backend as solicitações aguardando recebimento, já convertidas. */
export async function buscarSolicitacoesPendentes(): Promise<SolicitacaoAghu[]> {
  const params: Record<string, string | number> = { limite: limiteConfigurado() };
  const dataInicio = (import.meta.env.VITE_AP_SOLICITACOES_DATA_INICIO ?? '').trim();
  if (dataInicio) params.data_inicio = dataInicio;

  const { data } = await api.get<SolicitacaoApiDto[]>('/api/solicitacoes', { params });
  return data.map(paraSolicitacaoAghu);
}
