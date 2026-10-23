# Modelagem de Casos de Uso

## 1. Diagrama de Casos de Uso
*(Inserir imagem ou Mermaid)*
```mermaid
flowchart LR
    %% Definição dos Atores
    R((Recepcionista))
    TM((Técnico de Macroscopia))
    TP((Técnico de Processamento))
    IHQ((Técnico de Imunohistoquímica))
    MR((Médico Residente))
    MP((Médico Patologista))
    ARQ((Arquivista))
    ADM((Gestor/Administrador))
    
    subgraph "Sistema Hospitalar"
        UC1([Realizar Triagem])
        UC2([Consultar Histórico])
        UC3([Prescrever Medicamento])
    end
    
    %% Relacionamentos
    E --- UC1
    E --- UC2
    M --- UC2
    M --- UC3
```
## 2. Especificação (Exemplo)
### UC001 - Triagem
* **Ator**: Enfermeiro.
* **Fluxo**: Selecionar paciente -> Inserir Sinais Vitais -> Calcular Manchester.

#### [CARE-UC001] Implementação da Triagem
* **Context**: Paciente identificado e autenticado.
* **Action**: Implementar lógica de cálculo do Protocolo de Manchester baseada em Sinais Vitais.
* **Result**: Classificação de risco persistida e enviada para o painel médico.
* **Evaluation**: Teste unitário deve validar 5 cenários de cores (Vermelho a Azul) com 100% de acurácia.
