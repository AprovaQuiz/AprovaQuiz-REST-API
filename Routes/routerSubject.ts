import { Router } from "express";
import { SubjectInterface } from "../Interfaces/Subject";
import { UserInterface } from "../Interfaces/User";
import { Matter } from "../Models/Matter";
import { verifyToken } from "../middlewares/authJWT";


export const subjectRouter = Router()

subjectRouter.post("/", async (request, response) => {
    //req.body
    const subject: SubjectInterface = request.body;
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const saveMatter = await Matter.create(subject);

                return response.status(201).json({
                    savedID: saveMatter.id,
                    message: "Assunto inserido no sistema"
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

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        try {
            const subject = await Matter.find().populate('materia')

            return response.status(201).json(subject);

        } catch (error) {
            return response.status(500).json({ error: error });
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }

});

subjectRouter.patch("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const subject: SubjectInterface = request.body;

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Matter.findByIdAndUpdate(id, subject);

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
            .json({ message: "O Assunto não foi encontrado" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Matter.findByIdAndDelete(id);

                return response.status(200).json({ message: "Assunto deletado" });
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