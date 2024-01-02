<template>
    <CmHeader :msg="msg" />
    <v-sheet class="ma-auto pa-4" elevation="4" rounded max-width="600" width="100%">
        <div class="w-100">
            <h2 class="text-weight-black">
                {{ boardDetail.boardTitle }}
            </h2>
            <v-row>
                <v-col cols="4">
                    {{ boardDetail.userName }}
                </v-col>
                <v-col cols="4" class="font-weight-light" style="font-size:14px">
                    작성일 : {{ boardDetail.boardRegdate.slice(0, 10) }}
                </v-col>
                <v-col cols="4" class="font-weight-light" style="font-size:14px" v-if="boardDetail.boardMdate">
                    수정일 : {{ boardDetail.boardMdate?.slice(0, 10) }}
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    {{ boardDetail.boardContent }}
                </v-col>
            </v-row>
        </div>
        <v-footer>
            <v-btn @click="backToList">
                목록
            </v-btn>
            <v-btn v-if="isWriter">
                수정
            </v-btn>
        </v-footer>

    </v-sheet>
</template>
<script setup lang="ts">
import CmHeader from '@/components/common/header/CmHeader.vue';
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

const backToList = () => {
    router.push('/board');
}

const checkWriter = () => {
    const loginUserNum = store.state.User.userNum;
    console.log(`board userNum = ${boardDetail.value.userNum} , login UserNum = ${loginUserNum}`);
    if (loginUserNum === boardDetail.value.userNum) {
        isWriter.value = true;
    }
}

onBeforeMount(() => {
    getBoardDetail();
});

</script>