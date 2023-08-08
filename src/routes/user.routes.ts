import html from "@elysiajs/html";
import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import userService from "../services/user.service";

const userRoutes = (app: Elysia) => app
    .use(
        jwt({
            secret: process.env.JWT_SECRET,
            exp: "7d"
        })
    )
    .use(html())
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
        async ({ body: userData, jwt, set, html }) => {
            const newUserId = await userService.create(userData);

            if (newUserId) {
                const token = await jwt.sign({
                    sub: newUserId
                });
                
                set.status = 200;

                return html(token);
            }

            set.status = 401;

            return html("Incorrect password");
        },
        { body: "user" }
    );

export default userRoutes;