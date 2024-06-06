import { ObjectId } from "mongoose"

export interface QuestionInterface {
    id: string,
    texto: string,
    alternativas: {
        textoAlt: string,
        letra: string
    }[],
    alternativaCorreta: string,
    image: ObjectId | undefined,
    lugarAno: string
}