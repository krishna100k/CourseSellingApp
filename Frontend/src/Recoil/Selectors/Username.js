import { selector } from "recoil";
import { userState } from "../Atoms/User";

export const UserNameState = selector({
    key: "UserNameState",
    get: ({get}) => {
        const state = get(userState);

        return state.username;
    }
})