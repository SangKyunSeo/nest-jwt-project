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
        <v-row justify="center">
            <v-col cols="auto">
                <v-btn>
                    submit
                </v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn>
                    cancel
                </v-btn>
            </v-col>
        </v-row>
    </v-sheet>
</template>
<script setup lang="ts">
/**
 * @description
 *    - title: 글쓰기 폼
 *    - menu: 메인 > 글쓰기 
 *    - layout: WriteBoard
 *    - dev: 서상균
 *    - devVersion : 01_20231227
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */

import { ref, Ref } from 'vue';

let title: Ref<string> = ref('');
let content: Ref<string> = ref('');
let titleWarn: Ref<boolean> = ref(false);
let contentWarn: Ref<boolean> = ref(false);

const checkLengthValidate = (type: string): void => {
    if (type === 'title') {
        titleWarn.value = title.value.length === 12 ? true : false;
    } else {
        contentWarn.value = content.value.length === 400 ? true : false;
    }
}


</script>
