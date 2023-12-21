import Vuex from "vuex";
import { UserState } from "./modules/user/userType";
import { User } from "./modules/user/userModules";

export interface RootState {
    User: UserState;
}

const store = new Vuex.Store({
    modules: {
        User,
    },
});

export default store;
