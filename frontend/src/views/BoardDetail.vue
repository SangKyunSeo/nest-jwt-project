<template>
    <CmHeader :msg="msg" @loginStatus="loginState" />
    <BoardDetailForm v-if="!showPasswordForm && !showModifyForm" :boardDetail="boardDetail" :isWriter="isWriter"
        @showPasswordForm="passwordForm" @formType="showFormType" />
    <ModifyCheckForm v-if="showPasswordForm && !showModifyForm" @showPasswordForm="passwordForm" :formType="formType"
        @showModifyForm="modifyForm" />
    <CmForm v-if="showModifyForm && !showPasswordForm" :boardDetail="boardDetail" :type="2" @loginStatus="backToHome"
        @showModifyForm="showBoardDetail" />
</template>
<script setup lang="ts">
import CmHeader from '@/components/common/header/CmHeader.vue';
import CmForm from '@/components/common/form/CmForm.vue';
import BoardDetailForm from '@/components/common/form/BoardDetailForm.vue';
import ModifyCheckForm from '@/components/common/form/ModifyCheckForm.vue';
import { Ref, ref, onBeforeMount } from 'vue';
import { AxiosI } from '@/util/axiosInterceptor';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

interface BoardDetail {
    boardNum: number,
    boardTitle: string,
    boardContent: string,
    boardRegdate: string,
    boardMdate: string | null,
    userName: string,
    userNum: number,
    boardSecret: number,
    boardSecretKey: string | null,
}

const store = useStore();
const msg: Ref<string> = ref('Board Detail');
const axiosI = new AxiosI();
const axios = axiosI.setupInterceptors();
const route = useRoute();
const router = useRouter();
const boardNum = route.query.boardNum;
const boardDetail: Ref<BoardDetail> = ref({
    boardNum: 0,
    boardTitle: '',
    boardContent: '',
    boardRegdate: '',
    boardMdate: '',
    userName: '',
    userNum: 0,
    boardSecret: 0,
    boardSecretKey: '',
});

let isWriter: Ref<boolean> = ref(false);
let showPasswordForm: Ref<boolean> = ref(false);
let showModifyForm: Ref<boolean> = ref(false);
let formType: Ref<number> = ref(1);
const getBoardDetail = async () => {
    await axios.get('/board/detail', {
        params: {
            boardNum: Number(boardNum)
        }
    })
        .then(res => {
            console.log(res.data);
            boardDetail.value = res.data;
            boardDetail.value.userName = res.data.user.userName;
            boardDetail.value.userNum = res.data.user.userNum;
            checkWriter();
        })
        .catch(error => console.log(error));
}

const checkWriter = () => {
    const loginUserNum = store.state.User.userNum;
    console.log(`board userNum = ${boardDetail.value.userNum} , login UserNum = ${loginUserNum}`);
    if (loginUserNum === boardDetail.value.userNum) {
        isWriter.value = true;
    } else isWriter.value = false;
}

const loginState = (data: boolean) => {
    if (data) checkWriter();
    else checkWriter();
}

const passwordForm = (data: boolean) => {
    showPasswordForm.value = data;
}

const modifyForm = (data: boolean) => {
    showModifyForm.value = data;
    showPasswordForm.value = !data;
}

const backToHome = (data: boolean) => {
    if (!data) {
        router.push('/');
    }
}

const showBoardDetail = (data: boolean) => {
    showModifyForm.value = data;
}

const showFormType = (data: number) => {
    formType.value = data;
}

onBeforeMount(() => {
    getBoardDetail();
});

</script>