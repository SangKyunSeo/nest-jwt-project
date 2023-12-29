<template>
    <CmHeader :msg="msg" />
    <BoardTable v-if="boardList" :header="boardTableHeader" :itemList="boardList" />
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

interface Board {
    boardNum: number,
    boardTitle: string,
    boardContent: string,
    boardRegdate: string,
    boardMdate: string,
    userName: string,
    boardSecret: number
}

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
            for (let i = 0; i < res.data.length; i++) {
                boardList.value.push(res.data[i]);
                boardList.value[i].userName = res.data[i].user.userName;
                boardList.value[i].boardRegdate = res.data[i].boardRegdate.slice(0, 10);
            }
        })
        .catch(error => console.log(error));
}

onMounted(() => {
    getBoardList();
});

</script>