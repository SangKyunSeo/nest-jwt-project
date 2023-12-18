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
                                <v-text-field label="Input ID" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Input PW" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="doLogin">Confirm</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="register">Register</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="close" >Close</v-btn>
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

const props = defineProps({
    title: {
        type: String
    },
    dialog: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['loginModal', 'registerModal'])

let dialog: Ref<boolean> = ref(props.dialog);

// 로그인
const doLogin = () => {

};

// 회원가입
const register = () => {
    emit('registerModal', true);
}

// 모달창 닫기
const close = ():void => {
    emit('loginModal', false);
}

</script>

    