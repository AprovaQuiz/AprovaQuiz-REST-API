import { QuestionInterface } from "../Interfaces/Question";
import { Question } from "../Models/Question";
import { Subject } from "../Models/Subject";
import { Topic } from "../Models/Topic";

export async function GenerateTest(
    subject: string, topic: string, questionCount: number
): Promise<QuestionInterface[] | null> {

    let questions: QuestionInterface[] = []
    if (subject == "nenhum" && topic == "nenhum") {
        //gerar padrão
        questions = await Question.find()

    }
    else if (topic == "nenhum") {

        const subjectRes = await Subject.find({ nome: subject })
        if (!subjectRes)
            return null
        const auxSearch = await Topic.populate('materia').find({ nome: subject })


        // questions = await Topic.find().populate('questions').select({ questions: 1 })
    }
    else {
        //Gerar com todos os filtros
    }

    return RandomQuestions((questions as QuestionInterface[]), questionCount)

}

//criar uma função para auxiliar na aleatorização

function RandomQuestions(questions: QuestionInterface[], total: number) {

    // calma lá paizão
    return questions
}