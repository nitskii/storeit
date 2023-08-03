import { JWTPayloadSpec } from "@elysiajs/jwt";
import { randomBytes, randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import db from "./db";
import { User, users } from "./schema";

export type UserData = {
    nickname: string,
    password: string
};

export type JwtSign = (payload: Record<string, string> & JWTPayloadSpec) => Promise<string>;

const create = async (user: UserData, sign: JwtSign) => {
    const [ existingUser ] = await db
        .select()
        .from(users)
        .where(eq(users.nickname, user.nickname))
        .limit(1)
        .all();

    if (existingUser) {
        const correctPassword = await Bun.password.verify(
            `${user.password}${existingUser.salt}`,
            existingUser.password
        );

        if (correctPassword) {
            const token = await sign({
                sub: existingUser.id
            });

            return token;
        }
    }

    const salt = randomBytes(8).toString("hex");
    const password = await Bun.password.hash(
        `${user.password}${salt}`,
        "bcrypt"
    );

    const id = randomUUID();

    const userToInsert: User = {
        id,
        nickname: user.nickname,
        password,
        salt: salt
    }

    await db
        .insert(users)
        .values(userToInsert)
        .run();

    const token = await sign({
        sub: id
    });

    return token;
};

export default {
    create
};