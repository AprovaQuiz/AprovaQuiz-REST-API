import { QuestionInterface } from "../Interfaces/Question";
import { SubjectInterface } from "../Interfaces/Subject";
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

        const subjectTopics: (SubjectInterface & {
            topics: {
                questions: QuestionInterface[]
            }[]
        }) | null = await Subject
            .findOne({ nome: subject })
            .select({ nome: 1 })
            .populate({
                path: 'topics', select: 'questions topic',
                populate: { path: 'questions', model: 'Question' }
            })
        // console.log(subjectTopics)
        if (!subjectTopics)
            return null

        subjectTopics.topics.forEach(topic => {
            questions = questions.concat(topic.questions)
        })
    }
    else {
        const topicsQuestions = await Topic.findOne({ nome: topic }).populate('questions')


        if (topicsQuestions)
            questions = topicsQuestions?.questions as QuestionInterface[]
    }

    console.log(questions)
    return RandomQuestions((questions as QuestionInterface[]), questionCount)

}

//criar uma função para auxiliar na aleatorização

function RandomQuestions(questions: QuestionInterface[], total: number) {

    // calma lá paizão
    return questions
}