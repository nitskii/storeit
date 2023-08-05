import type { UserData } from "../models/user.model";
import userModel from "../models/user.model";

const create = async (userData: UserData) => {
    return await userModel.create(userData);
};

export default {
    create
};