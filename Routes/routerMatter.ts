import { Router } from "express";
import { verifyToken } from "../middlewares/authJWT";
import { UserInterface } from "../Interfaces/User";
import { MatterInterface } from "../Interfaces/Matter";
import { Matter } from "../Models/Matter";

export const matterRouter = Router()

matterRouter.post("/", async (request, response) => {
    //req.body
    const matter: MatterInterface = request.body;
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const saveMatter = await Matter.create(matter);

                return response.status(201).json({
                    savedID: saveMatter.id,
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

matterRouter.get("/", async (request, response) => {

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        try {
            const matter = await Matter.find();

            return response.status(201).json(matter);

        } catch (error) {
            return response.status(500).json({ error: error });
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }

});

matterRouter.patch("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const matter: MatterInterface = request.body;

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Matter.findByIdAndUpdate(id, matter);

                return response.status(200).json(matter);
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

matterRouter.delete("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const matter: MatterInterface = request.body;

    if (!matter) {
        return response
            .status(422)
            .json({ message: "A Matéria não foi encontrado" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Matter.findByIdAndDelete(id);

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