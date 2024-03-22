export interface HistoricInterface {
    id: string,
    questoesFeitas: [{ questao: string, respRegistrada: string }],
    qtdDeAcertos: number,
    qtdDeErros: number,
    tipoSimulado: {
        materia: string,
        assunto: string
    },
    user: string
}