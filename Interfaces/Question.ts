import { ObjectId } from "mongoose"

export interface QuestionInterface {
    id: string,
    enunciado: string,
    pergunta: string,
    alternativas: {
        textoAlt: string,
    }[],
    alternativaCorreta: number,
    image: ObjectId | undefined,
    lugarAno: string
}