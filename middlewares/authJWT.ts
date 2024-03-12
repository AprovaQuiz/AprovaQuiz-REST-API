import jwt from "jsonwebtoken";
import { User } from "../models/User";
import "dotenv/config";
import { UserInterface } from "../Interfaces/User";
import { verify } from 'jsonwebtoken';

export async function verifyToken(req: string | undefined): Promise<UserInterface | undefined | boolean> {
    let user
    if (req && req.split(" ")[0] === "JWT") {
        await verify(
            req.split(" ")[1],
            process.env.API_SECRET || "",
            async function (err, decode) {
                try {
                    user = await User.findById(
                        (decode as jwt.JwtPayload).id
                    );
                } catch (error) {
                    user = null;
                }
            }
        );
        if (user)
            return user as UserInterface
        else
            return false

    } else {
        return false;
    }

}
