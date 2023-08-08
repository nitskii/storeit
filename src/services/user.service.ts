import { randomBytes, randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import db from "../db";
import { User, users } from "../db/schema";

export type UserData = {
    nickname: string,
    password: string
};

const create = async (userData: UserData) => {
    const [ existingUser ] = await db
        .select()
        .from(users)
        .where(eq(users.nickname, userData.nickname))
        .limit(1)
        .all();

    if (existingUser) {
        const correctPassword = await Bun.password.verify(
            `${userData.password}${existingUser.salt}`,
            existingUser.password
        );

        if (correctPassword) {
            return existingUser.id;
        }

        return null;
    }

    const salt = randomBytes(8).toString("hex");
    const password = await Bun.password.hash(
        `${userData.password}${salt}`,
        "bcrypt"
    );

    const newUserId = randomUUID();

    const userToInsert: User = {
        id: newUserId,
        nickname: userData.nickname,
        password,
        salt
    }

    await db
        .insert(users)
        .values(userToInsert)
        .run();

    return newUserId;
};

export default {
    create
};