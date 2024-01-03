<template>
    <v-sheet v-if="boardDetail" class="ma-auto pa-4" elevation="4" rounded max-width="600" width="100%">
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
            <v-btn v-if="isWriter" @click="boardModify">
                수정
            </v-btn>
        </v-footer>
    </v-sheet>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
    boardDetail: {
        type: Object
    },
    isWriter: {
        type: Boolean
    }
});

const emit = defineEmits(['showPasswordForm']);

const router = useRouter();

const backToList = () => {
    router.push('/board');
}

const boardModify = () => {
    emit('showPasswordForm', true);
}
</script>