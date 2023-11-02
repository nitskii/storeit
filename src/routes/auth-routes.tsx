import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import userService from "../services/auth-service";
import { UserCredentials } from "../types";
import { HttpError } from "../utils";

const validateCrenentials = (credentials: UserCredentials) => {
  const { nickname, password } = credentials;

  if (nickname.length < 3 || nickname.length > 30) {
    throw new HttpError(
      'Нікнейм повинен мати від 3 до 30 символів',
      'INVALID_NICKNAME',
      400
    )
  }

  if (password.length < 3 || password.length > 30) {
    throw new HttpError(
      'Пароль повинен мати від 8 до 50 символів',
      'INVALID_PASSWORD',
      400
    )
  }
};

const authRoutes = new Elysia()
  .guard(
    {
      error: ({ error, set }) => {
        set.headers["Content-Type"] = "text/html;charset=utf-8";

        if (error instanceof HttpError) {
          set.headers["HX-Reswap"] = "afterend";
          set.status = error.status;

          switch (error.code) {
            case "INVALID_NICKNAME":
            case "USER_NOT_FOUND":
            case "USER_ALREADY_EXISTS":
              set.headers["HX-Retarget"] = "#nickname-input";
              break;
            case "INVALID_PASSWORD":
            case "INCORRECT_PASSWORD":
              set.headers["HX-Retarget"] = "#password-input";
              break;
          }

          return (
            <div class="pl-2 pt-1 text-red-500">
              {error.message}
            </div>
          )
        }

        return error.message;
      }
    },
    app => app
      .use(
        jwt({
          secret: process.env.SECRET,
        })
      )
      // doesn't work when NODE_ENV is production
      // moved validation to handlers
      // .model({
      //   user: t.Object({
      //     nickname: t.String({
      //       minLength: 3,
      //       maxLength: 30,
      //       error: "Нікнейм повинен мати від 3 до 30 символів"
      //     }),
      //     password: t.String({
      //       minLength: 8,
      //       maxLength: 50,
      //       error: "Пароль повинен мати від 8 до 50 символів",
      //     }),
      //   })
      // })
      .model({
        user: t.Object({
          nickname: t.String(),
          password: t.String()
        })
      })
      .post(
        "/signup",
        async ({ body: credentials, jwt, set }) => {
          validateCrenentials(credentials);

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
          validateCrenentials(credentials);

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
