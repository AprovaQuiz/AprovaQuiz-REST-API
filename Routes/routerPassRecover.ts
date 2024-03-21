import { Router } from "express"
import { User } from "../Models/User";
import { UserInterface } from "../Interfaces/User";
import { PassRecover } from "../Models/PassRecover";
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";
import { verifyToken } from "../middlewares/authJWT";

export const passRecoverRouter = Router()



passRecoverRouter.post('/', async (request, response) => {

    const user: UserInterface = request.body

    try {


        const userFound = await User.findOne({ email: user.email })

        if (!userFound) {
            return response.status(401)
                .json({
                    message: 'O usuário Inválido.'
                });
        }

        const savedPassRocover = await PassRecover.create({ user: (userFound as UserInterface).id, number: Math.floor(1000 + Math.random() * 9000) })

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: "hannah.macgyver35@ethereal.email",
                pass: "KQp5fFHupkS4dvHPUM",
            },
        });

        await transporter.sendMail({
            from: 'hannah.macgyver35@ethereal.email', // sender address
            to: user.email, // list of receivers
            subject: "Recuperar senha AprovaQuiz", // Subject line
            text: "Aqui está o código enviado para seu email", // plain text body
            html: `<b>Aqui está seu código: ${savedPassRocover.number}</b>`, // html body
        });

        return response.status(200)
            .json({
                PassRecover: savedPassRocover.id,
                message: "Criado número de recuperação com sucesso e mandado para o Email"
            })

    }
    catch (error) {
        return response.status(500)
            .json({
                message: error
            });

    }
})


passRecoverRouter.patch('/password', async (request, response) => {

    const { email, password, number } = request.body

    const userFound = await User.findOne({ email: email })

    if (!userFound) {
        return response.status(401)
            .json({
                message: 'O usuário Inválido.'
            });
    }

    try {
        const passRecover = await PassRecover.findOne({ user: userFound.id }).sort({ createdAt: -1 })

        if (passRecover?.number != number)
            return response.status(401).json({ message: "Número de verificação errado", sla: passRecover?.number })

        if (password) {
            const senhaHash = await bcrypt.hash(password, 10)


            try {

                const userUpdated = await User.findByIdAndUpdate(userFound, { senha: senhaHash })


                return response.status(200).json(userUpdated)

            } catch (error: unknown) {

                return response.status(500).json({ error: error })
            }
        }


    } catch (error) {
        return response.status(500)
            .json({
                message: error
            });
    }
})

passRecoverRouter.delete("/:id", async (request, response) => {
    const id = request.params.id;
    const token = await verifyToken(request.headers.authorization)
    const passRecover = await PassRecover.findById(id);

    if (!passRecover) {
        return response
            .status(422)
            .json({ message: "A passRecover não foi encontrada" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await PassRecover.findByIdAndDelete(id);

                return response.status(200).json({ message: "passRecover deletada" });
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

passRecoverRouter.get("/", async (request, response) => {
    const token = await verifyToken(request.headers.authorization)


    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const passRecovers = await PassRecover.find()

                return response.status(200).json(passRecovers);
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

passRecoverRouter.delete("/", async (request, response) => {
    const token = await verifyToken(request.headers.authorization)


    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await PassRecover.deleteMany()

                return response.status(200).json({ message: "passRecover deletados" });
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
