import { Router } from "express";
import { CalendarInterface } from "../Interfaces/Calendar";
import { verifyToken } from "../middlewares/authJWT";
import { UserInterface } from "../Interfaces/User";
import { Calendar } from "../Models/Calendar";

export const calendarRouter = Router()

calendarRouter.post("/", async (request, response) => {
    //req.body
    const calendar: CalendarInterface = request.body;
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const saveCalendar = await Calendar.create(calendar);

                return response.status(201).json({
                    savedID: saveCalendar.id,
                    message: "Calendário inserido no sistema"
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

calendarRouter.get("/", async (request, response) => {

    try {
        const calendar = await Calendar.find();

        return response.status(201).json(calendar);

    } catch (error) {
        return response.status(500).json({ error: error });
    }

});

calendarRouter.patch("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const calendar: CalendarInterface = request.body;

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Calendar.findByIdAndUpdate(id, calendar);

                return response.status(200).json(calendar);
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

calendarRouter.delete("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const calendar: CalendarInterface = request.body;

    if (!calendar) {
        return response
            .status(422)
            .json({ message: "O calendário não foi encontrado" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Calendar.findByIdAndDelete(id);

                return response.status(200).json({ message: "calendário deletado" });
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