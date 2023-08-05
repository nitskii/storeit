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
        async ({ body: user, jwt }) => {
            const newUserId = await userController.create(user);

            const token = await jwt.sign({
                sub: newUserId
            });

            return token;
        },
        { body: "user" }
    );

export default userRoutes;