<template>
    <v-card>
        <v-data-table :headers="header" :items="itemList">
            <template v-slot:item="{ item }: any">
                <tr @click="boardDetail(item.boardNum, item.boardSecret)" class="board-rows">
                    <td>{{ item.boardNum }}</td>
                    <td>{{ item.boardTitle }}</td>
                    <td v-if="item.boardSecret === 1">Secret Board</td>
                    <td v-else>{{ item.boardContent }}</td>
                    <td>{{ item.boardRegdate }}</td>
                    <td>{{ item.boardMdate }}</td>
                    <td v-if="item.boardSecret === 1">Secret</td>
                    <td v-else>{{ item.userName }}</td>
                    <td>{{ item.boardSecret === 1 ? 'O' : 'X' }}</td>
                </tr>
            </template>
        </v-data-table>
    </v-card>
</template>
<script setup lang="ts">
import { defineProps, PropType, defineEmits } from 'vue';

defineProps({
    header: {
        type: Array as PropType<Object[]>
    },
    itemList: {
        type: Array
    }
});
const emit = defineEmits(['boardInfo'])

const boardDetail = (boardNum: number, boardSecret: number): void => {

    emit('boardInfo', { boardNum: boardNum, boardSecret: boardSecret });


}

</script>
<style scoped>
.board-rows {
    cursor: pointer;
}
</style>