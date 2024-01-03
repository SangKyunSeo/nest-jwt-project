<template>
    <v-sheet class="ma-auto pa-4" elevation="4" rounded max-width="600" width="100%">
        <div class="w-100">
            <h2 v-if="formType === 1" class="text-weight-black">
                Modify check
            </h2>
            <h2 v-else class="text-weight-black">
                Delete check
            </h2>
            <v-row>
                <v-col cols="4">
                    <v-list-subheader>Password</v-list-subheader>
                </v-col>
                <v-col cols="8">
                    <v-text-field label="password" clearable v-model="password" type="password"></v-text-field>
                </v-col>
            </v-row>
        </div>
        <v-footer>
            <v-btn @click="backToList">
                목록
            </v-btn>
            <v-btn @click="boardModify">
                확인
            </v-btn>
        </v-footer>
    </v-sheet>
</template>
<script setup lang="ts">
import { Ref, ref, defineEmits, defineProps } from 'vue';
import { AxiosI } from '@/util/axiosInterceptor';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    formType: {
        type: Number
    }
})
let password: Ref<string> = ref('');
const emit = defineEmits(['showPasswordForm', 'showModifyForm']);
const axiosI = new AxiosI();
const axios = axiosI.setupInterceptors();
const store = useStore();
const userNum: number = store.state.User.userNum
const route = useRoute();
const router = useRouter();
const boardNum = route.query.boardNum;

const backToList = () => {
    emit('showPasswordForm', false);
}

const boardModify = async (): Promise<void> => {
    if (passwordValid(password.value)) {
        await axios.get('/user/passwordCheck', {
            params: {
                userNum: userNum,
                userPw: password.value
            }
        }).then(res => {
            if (!res.data) {
                alert('Password is wrong!');
                password.value = '';
            } else {
                if (props.formType === 1) {
                    // 수정 페이지로 이동
                    emit('showModifyForm', true);
                } else {
                    // 삭제 시키기 
                    deleteBoard();
                }
            }
        }).catch(error => {
            console.log(error)
            store.dispatch('User/actionLogout', userNum);
        });
    } else {
        password.value = '';
    }

}

// 게시글 삭제 API
const deleteBoard = async () => {
    await axios.delete('/board/delete', {
        data: { boardNum: boardNum }
    })
        .then(res => {
            if (res.data) {
                alert('게시글 삭제 성공');
                router.push('/board');
            } else {
                alert('게시글 삭제 실패');
                router.push('/board');
            }
        })
        .catch(error => console.log(error));
}

const passwordValid = (password: string): boolean => {
    if (password.includes(' ')) {
        alert('Password must not have spaces!');
        return false;
    }

    if (password.length === 0) {
        alert('Password is empty!');
        return false;
    }

    return true;

}
</script>