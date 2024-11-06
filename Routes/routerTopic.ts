import { Router } from "express";
import { UserInterface } from "../Interfaces/User";
import { verifyToken } from "../middlewares/authJWT";
import { TopicInterface } from "../Interfaces/Topic";
import { Topic } from "../Models/Topic";


export const topicRouter = Router()

topicRouter.post("/", async (request, response) => {
    //req.body
    const topic: TopicInterface = request.body;
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const saveTopicTopic = await Topic.create(topic);

                return response.status(201).json({
                    savedID: saveTopicTopic.id,
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
            const topic = await Topic.find().populate('materia')

            return response.status(201).json(topic);

        } catch (error) {
            return response.status(500).json({ error: error });
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }

});

topicRouter.get("/idTopic/:nome", async (request, response) => {
    const nome = request.params.nome

    try {
        const topic = await Topic.findOne({ nome: nome })
        if (!topic) {
            return response.status(422).json({ message: 'Tópico não encontrado' })

        }

        return response.status(201).json({ id: topic.id });

    } catch (error) {
        return response.status(500).json({ error: error });
    }


});

topicRouter.get("/:id", async (request, response) => {
    const id = request.params.id
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        try {
            const topic = await Topic.findById(id)
            if (!topic) {
                return response.status(422).json({ message: 'Tópico não encontrado' })

            }

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
                await Topic.findByIdAndUpdate(id, topic);

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
                await Topic.findByIdAndDelete(id);

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