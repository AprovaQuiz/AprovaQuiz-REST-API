import { Router } from "express";
import { HistoricInterface } from "../Interfaces/Historic";
import { UserInterface } from "../Interfaces/User";
import { verifyToken } from "../middlewares/authJWT";
import { Historic } from "../Models/Historic";

export const historicRouter = Router()

historicRouter.post('/', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)
    const historic: HistoricInterface = request.body

    if (token) {
        try {

            if (historic.user == null) {
                historic.user = (token as UserInterface).id
            }

            if ((token as UserInterface).role == "normal" && historic.user != (token as UserInterface).id)
                return response.status(401).json({ message: "Você não pode inserir histórico, de outro usuário" })

            const savedHistoricHistoric = await Historic.create(historic)
            return response.status(201).json({
                saveID: savedHistoricHistoric.id,
                message: 'Historico no sistema'
            })

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token inválido" })
    }
})

historicRouter.get('/', async (request, response) => {

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {

                const historics = await Historic.find()
                return response.status(200).json(historics)

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

historicRouter.get('/myHistorics', async (request, response) => {

    const token = await verifyToken(request.headers.authorization)


    if (token) {

        try {

            const historics = await Historic.find({ user: (token as UserInterface).id })
                // Da para facilmente colocar uma imagem aqui
                .populate({ path: "tipoSimulado", populate: { path: "materia assunto", select: "nome pertence" } })
                .populate({ path: "questoesFeitas", populate: { path: "questao" } })
            return response.status(200).json(historics)

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

historicRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    const token = await verifyToken(request.headers.authorization)

    if (token) {

        try {
            const historic = await Historic.findById(id).populate({ path: "tipoSimulado", populate: { path: "materia assunto", select: "nome pertence" } })

            if (!historic) {
                return response.status(422).json({ message: 'Valores de historico não foram encontrados' })

            }
            if (historic.user == (token as UserInterface).id || (token as UserInterface).role == "admin")
                return response.status(200).json(historic)
            else
                return response.status(401).json({ message: "Você não possui este acesso" })

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    }
    else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

historicRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro    
    const historic: HistoricInterface = request.body
    const token = await verifyToken(request.headers.authorization)
    const historicUserId = await Historic.findById(id).select({ user: 1 })

    if (token) {
        if (
            (historic.user && (historicUserId?.user != historic.user))
            && (token as UserInterface).role == "normal"
        )
            return response.status(401).json({ message: "Você não possui este acesso" })

        try {

            await Historic.findByIdAndUpdate(id, historic)


            return response.status(200).json(historic)


        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

historicRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const historic = await Historic.findById(id)
    const token = await verifyToken(request.headers.authorization)

    if (!historic) {
        return response.status(422).json({ message: 'Este valor de consumo não foi encontrado' })
    }

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == historic.user) {
            try {

                await Historic.findByIdAndDelete(id)

                return response.status(200).json({ message: 'Valor de consumo deletado' })
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