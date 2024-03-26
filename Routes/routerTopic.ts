import { Router } from "express";
import { UserInterface } from "../Interfaces/User";
import { Subject } from "../Models/Subject";
import { verifyToken } from "../middlewares/authJWT";
import { TopicInterface } from "../Interfaces/Topic";


export const topicRouter = Router()

topicRouter.post("/", async (request, response) => {
    //req.body
    const topic: TopicInterface = request.body;
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const saveSubject = await Subject.create(topic);

                return response.status(201).json({
                    savedID: saveSubject.id,
                    message: "Topico inserido no sistema"
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

topicRouter.get("/", async (request, response) => {

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        try {
            const topic = await Subject.find().populate('materia')

            return response.status(201).json(topic);

        } catch (error) {
            return response.status(500).json({ error: error });
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }

});

topicRouter.patch("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const topic: TopicInterface = request.body;

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Subject.findByIdAndUpdate(id, topic);

                return response.status(200).json(topic);
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

topicRouter.delete("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const topic: TopicInterface = request.body;

    if (!topic) {
        return response
            .status(422)
            .json({ message: "O Topico não foi encontrado" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Subject.findByIdAndDelete(id);

                return response.status(200).json({ message: "Topico deletado" });
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