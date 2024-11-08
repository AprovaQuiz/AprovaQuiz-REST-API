import { Router } from "express";
import { verifyToken } from "../middlewares/authJWT";
import { UserInterface } from "../Interfaces/User";
import { News } from "../Models/News";
import { NewsInterface } from "../Interfaces/News";

export const newsRouter = Router()

newsRouter.post("/", async (request, response) => {
    //req.body
    const news: NewsInterface = request.body;
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const saveNews = await News.create(news);

                return response.status(201).json({
                    savedID: saveNews.id,
                    message: "Notícias inserido no sistema"
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

newsRouter.get("/", async (request, response) => {

    try {
        const news = await News.find();

        return response.status(201).json(news);

    } catch (error) {
        return response.status(500).json({ error: error });
    }


});

newsRouter.patch("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const news: NewsInterface = request.body;

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await News.findByIdAndUpdate(id, news);

                return response.status(200).json(news);
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

newsRouter.get("/titulo/:titulo", async (request, response) => {
    const titulo = request.params.titulo; // se alterar em cima altera o parâmetro

    try {
        const news = await News.findOne({ titulo: titulo });

        if (!news) return response.status(422).json({ message: 'Notícia não encontrada' })

        return response.status(200).json(news);
    } catch (error) {
        return response.status(500).json({ error: error });
    }


});

newsRouter.delete("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const news: NewsInterface = request.body;

    if (!news) {
        return response
            .status(422)
            .json({ message: "A notócia não foi encontrada" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await News.findByIdAndDelete(id);

                return response.status(200).json({ message: "Notícia deletado" });
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