<template>
    <CmHeader :msg="msg" />
    <BoardTable v-if="boardList" :header="boardTableHeader" :itemList="boardList" @boardInfo="goBoardDetail" />
</template>
<script setup lang="ts">
/**
 * @description
 *    - title: 메인 게시글
 *    - menu: 메인 > 게시글
 *    - layout: BoardHome
 *    - dev: 서상균
 *    - devVersion : 01_20231229
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */

import CmHeader from '@/components/common/header/CmHeader.vue';
import BoardTable from '@/components/common/table/BoardTable.vue';
import { ref, Ref, onMounted } from 'vue';
import { AxiosI } from '@/util/axiosInterceptor';
import { useRouter } from 'vue-router';

interface Board {
    boardNum: number,
    boardTitle: string,
    boardContent: string,
    boardRegdate: string,
    boardMdate: string,
    userName: string,
    boardSecret: number
}

interface BoardInfo {
    boardNum: number,
    boardSecret: number
}

const router = useRouter();
const msg: Ref<string> = ref('BoardHome');
const axiosI = new AxiosI();
const axios = axiosI.setupInterceptors();
const boardList: Ref<Board[]> = ref([]);
const boardTableHeader = [
    { align: 'center', key: 'boardNum', title: 'Num' },
    { align: 'center', key: 'boardTitle', title: 'Title' },
    { align: 'center', key: 'boardContent', title: 'Content' },
    { align: 'center', key: 'boardRegdate', title: 'Regdate' },
    { align: 'center', key: 'boardMdate', title: 'Modifydate' },
    { align: 'center', key: 'userName', title: 'Name' },
    { align: 'center', key: 'boardSecret', title: 'Secret' }
]
const getBoardList = async (): Promise<void> => {
    await axios.get('/board/list')
        .then((res) => {
            console.log(res.data);
            boardList.value = res.data;
        })
        .catch(error => console.log(error));
}

const goBoardDetail = async (data: BoardInfo) => {
    let result: boolean = true;

    if (data.boardSecret === 1) {
        const secretKey = prompt('Input the secrey key');

        // api 통신을 통해 DB에 저장된 시크릿 키와 비교
        const resultData = await axios.post('/board/keyCheck', {
            boardNum: data.boardNum,
            boardSecretKey: secretKey
        });
        result = resultData.data;
        console.log('비밀글 키 체크 : ' + resultData.data);
        if (!resultData.data) {
            alert('Secret key does not match!');

        }
    }

    if (result) {
        router.push({
            path: '/boardDetail',
            query: { 'boardNum': data.boardNum }
        })
    }

}

onMounted(() => {
    getBoardList();
});

</script>