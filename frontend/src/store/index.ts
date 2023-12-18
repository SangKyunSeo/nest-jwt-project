import Vuex from 'vuex';
import { MemberState } from './modules/user/userType';
import { User } from './modules/user/userModules';

export interface RootState {
    User : MemberState
}

const store = new Vuex.Store({
    modules: {
        User
    }
});

export default store;