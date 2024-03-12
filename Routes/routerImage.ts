import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { ImageInterface } from "../Interfaces/Image";
import { verifyToken } from "../middlewares/authJWT";
import { Image } from "../models/Image";
import { UserInterface } from "../Interfaces/User";
import { upload } from "../middlewares/storageImg";

export const imageRouter = Router()

imageRouter.post('/', upload.single('image'), async (request, response) => {

    const token = await verifyToken(request.headers.authorization)
    const img: ImageInterface = request.body


    if (token) {
        try {

            img.img = {
                data: fs.readFileSync(path.join(__dirname, '..', 'uploads', request.file?.filename || "")),
                contentType: 'image/png'
            }

            const savedImg = await Image.create(img)

            return response.status(201).json({
                savedID: savedImg.id,
                message: 'Imagem inserida no sistema'
            })
        }
        catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }

})

imageRouter.get('/', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {


                const img = await Image.find().select({ img: { data: 0 } })
                return response.status(200).json(img)

            } catch (error) {
                return response.status(500).json({ error: error })
            }
        } else {
            return response.status(401).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }





})

imageRouter.get("/:id", async (request, response) => {

    const id = request.params.id;


    try {
        const image = await Image.findById(id);

        if (!image) {
            return response
                .status(422)
                .json({ message: "A imagem não foi encontrada" });
        }
        return response.status(200).json(image);
    } catch (error) {
        return response.status(500).json({ error: error });
    }


})

imageRouter.delete("/:id", async (request, response) => {
    const id = request.params.id;
    const token = await verifyToken(request.headers.authorization)
    const image = await Image.findById(id);

    if (!image) {
        return response
            .status(422)
            .json({ message: "A imagem não foi encontrada" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Image.findByIdAndDelete(id);

                return response.status(200).json({ message: "Imagem deletada" });
            } catch (error) {
                return response.status(500).json({ error: error });
            }
        } else {
            return response.status(401).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})