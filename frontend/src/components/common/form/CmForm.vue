<template>
    <v-sheet width="50%" class="ma-auto pa-6" border>
        <v-row>
            <v-col cols="4">
                <v-list-subheader class="p-12">TITLE</v-list-subheader>
            </v-col>
            <v-col cols="8">
                <v-text-field label="title" clearable v-model="title" maxlength="12" hint="Max length is 12"
                    @input="checkLengthValidate('title')"></v-text-field>
                <span v-if="titleWarn" class="text-red font-weight-bold">Title length is fullfilled</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <v-list-subheader>CONTENT</v-list-subheader>
            </v-col>
            <v-col cols="8">
                <v-textarea clearable label="content" auto-grow max-rows="15" v-model="content" maxlength="400"
                    hint="Max length is 400" @input="checkLengthValidate('content')"></v-textarea>
                <span v-if="contentWarn" class="text-red font-weight-bold">Content length is fullfilled</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <v-list-subheader>SECRET</v-list-subheader>
            </v-col>
            <v-col cols="8">
                <v-switch id="secretLabel" color="primary" v-model="isSecret" true-value="1" false-value="0"
                    @change="secretChangeEvent">
                    <template v-slot:label>
                        <span id="switchLabel" :class="{
                            on: isSecret === '1'
                        }">
                            secret
                        </span>
                    </template>
                </v-switch>
            </v-col>
        </v-row>
        <v-row v-if="isSecret === '1'">
            <v-col cols="4">
                <v-list-subheader>SECRET KEY</v-list-subheader>
            </v-col>
            <v-col cols="8">
                <v-text-field label="secret key" clearable v-model="secretKey" maxlength="12" hint="Max length is 12"
                    type="password" @input="checkLengthValidate('secretKey')"></v-text-field>
                <span v-if="secretKeyWarn" class="text-red font-weight-bold">Secret key length is fullfilled</span>
            </v-col>
        </v-row>
        <v-row justify="center" v-if="type === 1">
            <v-col cols="auto">
                <v-btn @click="doWrite(1)">submit</v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn @click="cancelWrite">cancel</v-btn>
            </v-col>
        </v-row>
        <v-row justify="center" v-if="type === 2">
            <v-col cols="auto">
                <v-btn @click="doWrite(2)">update</v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn @click="cancelUpdate">cancel</v-btn>
            </v-col>
        </v-row>
    </v-sheet>
</template>
<script setup lang="ts">
/**
 * @description
 *    - title: 글쓰기, 수정 폼
 *    - menu: 메인 > 글쓰기, 수정
 *    - layout: WriteBoard
 *    - dev: 서상균
 *    - devVersion : 01_20231227
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */

import { ref, Ref, defineEmits, defineProps, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AxiosI } from "@/util/axiosInterceptor";
import { useStore } from 'vuex';

let title: Ref<string> = ref('');
let content: Ref<string> = ref('');
let titleWarn: Ref<boolean> = ref(false);
let contentWarn: Ref<boolean> = ref(false);
let secretKeyWarn: Ref<boolean> = ref(false);
let isSecret: Ref<string> = ref('0');
let secretKey: Ref<string> = ref('');

const router = useRouter();
const axiosI = new AxiosI();
const axios = axiosI.setupInterceptors();
const store = useStore();
const userNum = store.state.User.userNum;
const emit = defineEmits(['loginStatus', 'showModifyForm']);

const props = defineProps({
    boardDetail: {
        type: Object
    },
    type: {
        type: Number
    }
});

const checkLengthValidate = (type: string): void => {
    if (type === 'title') {
        titleWarn.value = title.value.length === 12 ? true : false;
    } else if (type === 'secretKey') {
        secretKeyWarn.value = secretKey.value.length === 12 ? true : false;
    } else {
        contentWarn.value = content.value.length === 400 ? true : false;
    }
}

// 유효성 검사
const inputValidate = (type: string, v: string): boolean => {
    if (v.trim().length === 0) {
        alert(`${type.toUpperCase()} must not empty!`);
        return false;
    }

    if (v.includes(' ') && (type === 'title' || type === 'secretKey')) {
        alert(`${type.toUpperCase()} must not include space!`);
        return false;
    }

    if (type === 'secretKey' && !(/\d/.test(secretKey.value))) {
        alert(`${type.toUpperCase()} must have only number!`);
        return false;
    }
    return true;
}

const doWrite = async (type: number): Promise<void> => {

    if (!inputValidate('title', title.value)) return;
    if (!inputValidate('content', content.value)) return;
    if (isSecret.value === '1' && !inputValidate('secretKey', secretKey.value)) return;



    if (type === 1) {
        const createBoardDTO = {
            boardTitle: title.value,
            boardContent: content.value,
            boardSecret: isSecret.value === '1' ? 1 : 0,
            userNum: userNum,
            boardSecretKey: secretKey.value === '' ? null : secretKey.value
        }
        // 글쓰기 API
        await axios.post('/board/create', {
            createBoardDTO
        })
            .then(res => {
                console.log('글쓰기 API 결과 : ' + res.data);
                if (res.data) {
                    alert('글 작성 성공');
                    router.push('/');
                } else {
                    alert('글 작성 실패');
                    router.push('/writeBoard');
                }
            })
            .catch(error => {
                console.log(error)
                store.dispatch('User/actionLogout', userNum);
                emit('loginStatus', false);
                console.log('글쓰기 API 에러 ');
            });
    }
    else {
        const updateBoardDTO = {
            boardNum: props.boardDetail?.boardNum,
            boardTitle: title.value,
            boardContent: content.value,
            boardSecret: isSecret.value === '1' ? 1 : 0,
            boardSecretKey: secretKey.value === '' ? null : secretKey.value
        }
        // 글 수정 API
        await axios.post('/board/update', {
            updateBoardDTO
        })
            .then(res => {
                console.log('글 수정 API 결과 : ' + res.data);
                if (res.data) {
                    alert('글 수정 성공');
                    emit('showModifyForm', false);
                } else {
                    alert('글 수정 실패');
                    emit('showModifyForm', false);
                }
            })
            .catch(error => {
                console.log(error);
                store.dispatch('User/actionLogout', userNum);
                emit('loginStatus', false);
            })
    }
}

const cancelWrite = (): void => {
    router.push('/');
}

const cancelUpdate = (): void => {
    emit('showModifyForm', false);
}

const secretChangeEvent = (): void => {
    if (isSecret.value === '0') {
        secretKey.value = '';
    }
}

const checkData = () => {
    if (props.boardDetail) {
        title.value = props.boardDetail.boardTitle;
        content.value = props.boardDetail.boardContent;
        isSecret.value = String(props.boardDetail.boardSecret);
        secretKey.value = props.boardDetail.boardSecretKey;
    }

    if (isSecret.value === '1') secretChangeEvent();
}

onMounted(() => {
    checkData();
});

</script>

<style scoped>
.on {
    color: red;
    font-weight: bold;
}
</style>