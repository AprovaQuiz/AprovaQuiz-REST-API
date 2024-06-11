export interface HistoricInterface {
    id: string,
    questoesFeitas: [{ questao: string, respRegistrada: number, acerto: boolean }],
    qtdDeAcertos: number,
    qtdDeErros: number,
    tipoSimulado: {
        materia: string,
        assunto: string
    },
    user: string
}