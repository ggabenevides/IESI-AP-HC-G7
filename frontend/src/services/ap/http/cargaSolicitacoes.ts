/**
 * Carga híbrida das solicitações AGHU: com `VITE_AP_FONTE_SOLICITACOES=api`, as solicitações
 * aguardando recebimento vêm do backend e substituem as do seed no "banco" do mock. Casos,
 * devoluções e não conformidades continuam no mock.
 *
 * A Promise da carga fica guardada aqui: o `aghuServiceMock` a aguarda antes de ler o banco,
 * para que nenhuma listagem use o seed enquanto a carga não terminou.
 */
import { useToast } from 'vue-toastification';
import { aplicarSolicitacoesExternas } from '../../../mocks/ap/db';
import { useAuthStore } from '../../../stores/auth';
import { useRecepcaoStore } from '../../../stores/recepcao';
import { buscarSolicitacoesPendentes, fonteSolicitacoes } from './solicitacaoApi';

/** Carga em andamento ou a última concluída (nunca rejeita). */
let cargaAtual: Promise<void> | null = null;
/** Indica se há uma carga em andamento (para reaproveitá-la em vez de duplicar). */
let emAndamento = false;

/** Executa a carga: aplica os dados da API ou mantém o seed e avisa. */
async function executarCarga(): Promise<void> {
  try {
    const solicitacoes = await buscarSolicitacoesPendentes();
    aplicarSolicitacoesExternas(solicitacoes);
  } catch (erro) {
    console.error('Falha ao carregar solicitações do backend; mantendo o seed.', erro);
    useToast().warning('Não foi possível carregar as solicitações do AGHU. Exibindo dados de demonstração.');
  } finally {
    emAndamento = false;
  }
}

/**
 * Atualiza o contador do menu, que pode ter sido calculado com o seed antes da carga.
 * Roda DEPOIS de a Promise da carga resolver (dentro dela haveria espera circular, pois
 * `contarPendentes` aguarda a própria carga).
 */
function atualizarContadorMenu(): void {
  useRecepcaoStore()
    .atualizarContagem()
    .catch((erro) => console.error('Falha ao atualizar o contador de pendentes.', erro));
}

/**
 * Carrega as solicitações do backend (modo "api"). Chamada após o login e ao recarregar a
 * página já autenticado. No modo "mock" não faz nada. A Promise nunca rejeita.
 */
export function carregarSolicitacoesDoBackend(): Promise<void> {
  if (fonteSolicitacoes() !== 'api') return Promise.resolve();
  if (emAndamento && cargaAtual) return cargaAtual;
  emAndamento = true;
  const carga = executarCarga();
  cargaAtual = carga;
  void carga.then(atualizarContadorMenu);
  return carga;
}

/**
 * Aguarda a carga antes de ler as solicitações. Se a página montou antes de a inicialização
 * da autenticação disparar a carga (F5 já autenticado), dispara-a aqui.
 */
export function aguardarCargaSolicitacoes(): Promise<void> {
  if (fonteSolicitacoes() !== 'api') return Promise.resolve();
  if (cargaAtual) return cargaAtual;
  if (useAuthStore().accessToken) return carregarSolicitacoesDoBackend();
  return Promise.resolve();
}
