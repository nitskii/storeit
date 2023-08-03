import type { JwtSign, UserData } from "../models/user.model";
import userModel from "../models/user.model";

const create = async (user: UserData, sign: JwtSign) => {
    return await userModel.create(user, sign);
};

export default {
    create
};