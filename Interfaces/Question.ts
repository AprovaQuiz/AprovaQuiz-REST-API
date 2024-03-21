export interface QuestionInterface {
    id: string,
    texto: string,
    alternativas: {
        textoAlt: string,
        letra: string
    },
    alternativaCorreta: string,
    image: string
}