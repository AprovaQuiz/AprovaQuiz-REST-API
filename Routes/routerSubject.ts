import { Router } from "express";
import { verifyToken } from "../middlewares/authJWT";
import { UserInterface } from "../Interfaces/User";
import { SubjectInterface } from "../Interfaces/Subject";
import { Subject } from "../Models/Subject";
import { Topic } from "../Models/Topic";

export const subjectRouter = Router()

subjectRouter.post("/", async (request, response) => {
    //req.body
    const subject: SubjectInterface = request.body;
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const saveSubject = await Subject.create(subject);

                return response.status(201).json({
                    savedID: saveSubject.id,
                    message: "Matéria inserida no sistema"
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

subjectRouter.get("/", async (request, response) => {

    try {
        const subject = await Subject.find();

        return response.status(201).json(subject);

    } catch (error) {
        return response.status(500).json({ error: error });
    }


});

subjectRouter.get("/withImages", async (request, response) => {

    try {
        const subject = await Subject.find().populate('image');

        return response.status(201).json(subject);

    } catch (error) {
        return response.status(500).json({ error: error });
    }


});

subjectRouter.get("/topics/:subjectParam", async (request, response) => {

    const subjectParam = request.params.subjectParam


    try {
        let topic
        if (subjectParam == "Nenhuma")
            topic = await Topic.find();
        else
            topic = await Subject.findOne({ nome: subjectParam }).populate('topics');

        return response.status(201).json(topic);

    } catch (error) {
        return response.status(500).json({ error: error });
    }


});

subjectRouter.get("/idSubject/:nome", async (request, response) => {

    const nome = request.params.nome


    try {

        const subject = await Subject.findOne({ nome: nome })

        if (!subject) {
            return response.status(422).json({ message: 'Matéria não encontrada' })

        }

        return response.status(201).json({ id: subject.id });

    } catch (error) {
        return response.status(500).json({ error: error });
    }


});

subjectRouter.patch("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const subject: SubjectInterface = request.body;

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Subject.findByIdAndUpdate(id, subject);

                return response.status(200).json(subject);
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

subjectRouter.delete("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const subject: SubjectInterface = request.body;

    if (!subject) {
        return response
            .status(422)
            .json({ message: "A Matéria não foi encontrado" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Subject.findByIdAndDelete(id);

                return response.status(200).json({ message: "Matéria deletada" });
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