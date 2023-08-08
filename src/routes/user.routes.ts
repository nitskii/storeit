import cookie from "@elysiajs/cookie";
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
    .use(cookie({
        maxAge: 120,
        sameSite: true
    }))
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
        async ({ body: userData, jwt, setCookie, set }) => {
            const newUserId = await userService.createOrLogin(userData);

            if (newUserId) {
                const token = await jwt.sign({
                    sub: newUserId
                });
                
                setCookie("auth", token);
                
                set.status = 204;
                set.headers["HX-Redirect"] = "/items";
                
                return;
            }

            set.status = 401;

            return {
                error: "Incorrect password"
            };
        },
        { body: "user" }
    );

export default userRoutes;