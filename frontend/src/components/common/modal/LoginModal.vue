<template>
    <v-row justify="center">
        <v-dialog width="500" v-model="dialog">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ title }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Input ID" required v-model="userId" id="input_id"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field type="password" label="Input PW" required v-model="userPw"
                                    id="input_pw"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="doLogin">Confirm</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="register">Register</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="close">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script setup lang="ts">
/**
 * @description
 *    - title: 로그인 모달
 *    - menu: 메인 > 로그인 
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231218
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */
import { defineProps, defineEmits, ref, Ref } from 'vue';
import { AxiosI } from "@/util/axiosInterceptor";
import { useStore } from 'vuex';

interface UserInfo {
    userNum: number,
    userName: string
}

interface LoginDTO {
    userId: string,
    userPw: string
}

const axiosI = new AxiosI();
const axios = axiosI.setupInterceptors();
const store = useStore();
const props = defineProps({
    title: {
        type: String
    },
    dialog: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['loginModal', 'registerModal', 'loginSuccess'])

let dialog: Ref<boolean> = ref(props.dialog);
let userId: Ref<string> = ref('');
let userPw: Ref<string> = ref('');
const userInfo: Ref<UserInfo> = ref({ userNum: 0, userName: '' });
const loginDTO: Ref<LoginDTO> = ref({ userId: '', userPw: '' });

// 로그인
const doLogin = async (): Promise<void> => {
    if (userId.value === '') {
        alert('Please Input ID');
        document.getElementById('input_id')?.focus();
        return;
    }

    if (userPw.value === '') {
        alert('Please Input Pw');
        document.getElementById('input_pw')?.focus();
        return;
    }

    loginDTO.value.userId = userId.value;
    loginDTO.value.userPw = userPw.value;

    // 로그인 API 
    await axios.post('/user/login', {
        loginDTO: loginDTO.value
    })
        .then(res => {
            console.log('Vue Login API result Data : ' + res.data);
            userInfo.value.userName = res.data.user.userName;
            userInfo.value.userNum = res.data.user.userNum;
            console.log(userInfo.value);
            store.dispatch('User/setStoreUserNum', userInfo.value.userNum);
            store.dispatch('User/setStoreUserName', userInfo.value.userName);
            store.dispatch('User/setStoreLoginStatus', true);
            store.dispatch('User/setLoginStorage');
            emit('loginSuccess', true);
        })
        .catch(error => {
            userId.value = '';
            userPw.value = '';
            console.log(error);
        });
};

// 회원가입
const register = () => {
    emit('registerModal', true);
}

// 모달창 닫기
const close = (): void => {
    emit('loginModal', false);
}

</script>

    