from abc import ABC, abstractmethod
from typing import List, Dict, Any


class SolicitacaoProviderInterface(ABC):
    """Interface (contrato) para provedores de solicitações de exames do AGHU.

    Cada registro retornado corresponde a um item de exame (uma linha da fonte),
    com as chaves originais da fonte de dados (snake_case).
    """

    @abstractmethod
    async def listar_solicitacoes(self) -> List[Dict[str, Any]]:
        """Deve retornar todos os itens de exame disponíveis na fonte."""
        pass

    @abstractmethod
    async def obter_itens_por_codigo(self, codigo: str) -> List[Dict[str, Any]]:
        """Deve retornar os itens de exame de uma solicitação (lista vazia se não existir)."""
        pass
