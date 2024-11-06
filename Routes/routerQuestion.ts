import { Router } from "express";
import { QuestionInterface } from "../Interfaces/Question";
import { UserInterface } from "../Interfaces/User";
import { Question } from "../Models/Question";
import { verifyToken } from "../middlewares/authJWT";
import { GenerateTest } from "../utils/GenerateTest";

export const questionRouter = Router()

questionRouter.post("/", async (request, response) => {
    //req.body
    const question: QuestionInterface = request.body;
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const saveQuestion = await Question.create(question);

                return response.status(201).json({
                    savedID: saveQuestion.id,
                    message: "Questão inserida no sistema"
                });
            } catch (error) {
                return response.status(500).json({ error: error });
            }
        } else {
            return response.status(401).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
});

questionRouter.get("/", async (request, response) => {

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        try {
            const question = await Question.find()

            return response.status(201).json(question);

        } catch (error) {
            return response.status(500).json({ error: error });
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }

});

questionRouter.patch("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const question: QuestionInterface = request.body;

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Question.findByIdAndUpdate(id, question);

                return response.status(200).json(question);
            } catch (error) {
                return response.status(500).json({ error: error });
            }
        } else {
            return response.status(401).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
});

questionRouter.delete("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const question: QuestionInterface = request.body;

    if (!question) {
        return response
            .status(422)
            .json({ message: "A Questão não foi encontrado" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Question.findByIdAndDelete(id);

                return response.status(200).json({ message: "Questão Deletada" });
            } catch (error) {
                return response.status(500).json({ error: error });
            }
        } else {
            return response.status(401).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
});

// getQuestions

questionRouter.get("/generateQuiz/:subject/:topic/:questionCount", async (request, response) => {
    // const dificulty = request.params.dificulty;
    const subject = request.params.subject;
    const topic = request.params.topic;
    const questionCount = request.params.questionCount;

    try {


        if (!Number(questionCount))
            return response.status(500).json({ message: "Número de questões inválidas" })


        const questions = await GenerateTest(subject, topic, Number(questionCount))


        return response.status(200).json(questions);

    } catch (error) {
        return response.status(500).json({ error: error });
    }

});