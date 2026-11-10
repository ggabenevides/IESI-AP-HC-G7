/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Fonte das solicitações AGHU da Recepção: "api" ou "mock" (padrão). */
  readonly VITE_AP_FONTE_SOLICITACOES?: string;
  /** Limite de solicitações carregadas da API (padrão 200, máximo 1000). */
  readonly VITE_AP_SOLICITACOES_LIMITE?: string;
  /** Data inicial (AAAA-MM-DD) das solicitações carregadas da API (opcional). */
  readonly VITE_AP_SOLICITACOES_DATA_INICIO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
