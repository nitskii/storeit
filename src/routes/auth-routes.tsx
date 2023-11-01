import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import userService from "../services/auth-service";
import { HttpError } from "../utils";

const authRoutes = new Elysia()
  .guard(
    {
      error: ({ error, set }) => {
        set.headers["HX-Reswap"] = "afterend";
        set.headers["Content-Type"] = "text/html;charset=utf-8";

        if (set.status == 400) {
          switch(error.message) {
            case "Нікнейм повинен мати від 3 до 30 символів":
              set.headers["HX-Retarget"] = "#nickname-input";
              break;
            case "Пароль повинен мати від 8 до 50 символів":
              set.headers["HX-Retarget"] = "#password-input";
              break;
          }
        } else if (error instanceof HttpError) {
          set.status = error.status;

          switch (error.code) {
            case "INCORRECT_PASSWORD":
              set.headers["HX-Retarget"] = "#password-input";
              break;
            case "USER_NOT_FOUND":
            case "USER_ALREADY_EXISTS":
              set.headers["HX-Retarget"] = "#nickname-input";
              break;
          }
        } else {
          set.headers['HX-Reswap'] = 'none';
        }

        return (
          <div class="pl-2 pt-1 text-red-500">
            {error.message || "Щось пішло не так"}
          </div>
        );
      }
    },
    app => app
      .use(
        jwt({
          secret: process.env.SECRET,
        })
      )
      .model({
        user: t.Object({
          nickname: t.String({
            minLength: 3,
            maxLength: 30,
            error: "Нікнейм повинен мати від 3 до 30 символів",
          }),
          password: t.String({
            minLength: 8,
            maxLength: 50,
            error: "Пароль повинен мати від 8 до 50 символів",
          }),
        }),
      })
      .post(
        "/signup",
        async ({ body: credentials, jwt, set }) => {
          const newUserId = await userService.signup(credentials);
          const token = await jwt.sign({ sub: newUserId });

          set.cookie = {
            auth: {
              value: token,
              path: "/",
              maxAge: process.env.COOKIE_MAX_AGE,
              sameSite: "strict",
            }
          };

          set.status = 204;
          set.headers["HX-Redirect"] = "/";
        },
        {
          body: "user",
        }
      )
      .post(
        "/login",
        async ({ body: credentials, jwt, set }) => {
          const userId = await userService.login(credentials);
          const token = await jwt.sign({ sub: userId });

          set.cookie = {
            auth: {
              value: token,
              path: "/",
              maxAge: process.env.COOKIE_MAX_AGE,
              sameSite: "strict"
            }
          };

          set.status = 204;
          set.headers["HX-Redirect"] = "/";
        },
        {
          body: "user",
        }
      )
      .post("/logout", async ({ set }) => {
        set.cookie = {
          auth: {
            value: "",
            path: "/",
            expires: new Date(1970, 0),
            sameSite: "strict",
          },
        };
        set.status = 204;
        set.headers["HX-Redirect"] = "/login";
      })
);

export default authRoutes;
