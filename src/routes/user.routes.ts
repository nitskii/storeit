import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import userController from "../controllers/user.controller";

const userRoutes = (app: Elysia) => app
    .use(
        jwt({
            secret: process.env.JWT_SECRET,
            exp: "7d"
        })
    )
    .model({
        user: t.Object({
            nickname: t.String({
                minLength: 3,
                maxLength: 30,
            }),
            password: t.String({
                minLength: 8,
                maxLength: 50
            })
        })
    })
    .put(
        "/user",
        async ({ body: userData, jwt, set }) => {
            const newUserId = await userController.create(userData);

            if (newUserId) {
                const token = await jwt.sign({
                    sub: newUserId
                });
                
                return token;
            }

            set.status = 401;

            return "Incorrect password";
        },
        { body: "user" }
    );

export default userRoutes;