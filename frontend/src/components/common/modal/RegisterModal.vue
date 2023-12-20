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
                                <v-text-field label="Input Name" required v-model="userDTO.userName" @keyup="inputName"
                                    id="input_name"></v-text-field>
                                <span id="warn-name"></span>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Input ID" required v-model="userDTO.userId" @keyup="inputId"
                                    id="input_id"></v-text-field>
                                <span id="warn-id"></span>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-btn v-if="checkDuplicate" color="blue" disabled>Duplicate</v-btn>
                                <v-btn v-else color="pink" @click="doDuplicate">Duplicate</v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Input PW" type="password" required v-model="userDTO.userPw"
                                    @keyup="inputPw" id="input_pw"></v-text-field>
                                <span id="warn-pw"></span>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Check PW" type="password" required v-model="checkPw"
                                    @keyup="inputCheckPw" id="input_check_pw"></v-text-field>
                                <span id="warn-check-pw"></span>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="doRegister">Confirm</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="close">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script setup lang="ts">
/**
 * @description
 *    - title: 회원가입 모달
 *    - menu: 메인 > 로그인 > 회원가입
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231218
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */

import { defineProps, defineEmits, ref, Ref } from "vue";
import REGEX from "@/constant/constant";
import { AxiosI } from "@/util/axiosInterceptor";

type UserDTO = {
    userName: string;
    userId: string;
    userPw: string;
};

const props = defineProps({
    title: {
        type: String,
    },
    dialog: {
        type: Boolean,
    },
});

const emit = defineEmits(["registerModal"]);

let dialog: Ref<boolean> = ref(props.dialog);
let checkPw: Ref<string> = ref("");
let nameValid: Ref<boolean> = ref(false);
let idValid: Ref<boolean> = ref(false);
let pwValid: Ref<boolean> = ref(false);
let checkPwValid: Ref<boolean> = ref(false);
let checkDuplicate: Ref<boolean> = ref(false);

const axiosI = new AxiosI();
const Axios = axiosI.setupInterceptors();

const userDTO: Ref<UserDTO> = ref({
    userName: "",
    userId: "",
    userPw: "",
});

// 회원가입
const doRegister = async () => {
    if (inputCheckValid()) {
        // 회원가입 진행
        await Axios.post('/user/register', {
            userDTO: userDTO.value
        })
            .then(res => {
                if (res.data) {
                    // 페이지 이동 
                    alert('Success regist');
                    close();
                } else {
                    alert('Fail regist!');
                    close();
                }
            })
            .catch(error => console.log(error));
    }
};

// 공백 검사 함수
const checkSpace = (input: string): boolean => {
    if (input.includes(" ")) return false;
    return true;
};

// 입력 가능한 길이 검사
const checkLength = (input: string, min: Number, max: Number): boolean => {
    if (input.length < min || input.length > max) return false;
    return true;
};

// 한글 입력 유효성 검사
const checkKorea = (input: string): boolean => {
    return REGEX.regexList.KOREA_REGEX.test(input);
};

// 비밀번호 영어 숫자 유효성 검사
const checkPassword = (input: string): boolean => {
    return REGEX.regexList.PASSWORD_REGEX.test(input);
};

// span 경고 출력
const printWarn = (id: string, text: string): void => {
    const el = document.getElementById(id);
    el!.innerHTML = text;
    el!.style.color = "red";
    el!.style.fontWeight = "bold";
};

// span 유효성 통과 출력
const printPass = (id: string, text: string): void => {
    const el = document.getElementById(id);
    el!.innerHTML = text;
    el!.style.color = "blue";
    el!.style.fontWeight = "bold";
};

// 이름 입력 유효성 검사
const inputName = (): void => {
    const id = "warn-name";
    if (!checkSpace(userDTO.value.userName)) {
        // 공백 검사
        printWarn(id, "Please do not input space");
        nameValid.value = false;
    } else if (!checkLength(userDTO.value.userName, 2, 10)) {
        // 길이 검사
        printWarn(id, "Please input name at least 2 to 10");
        nameValid.value = false;
    } else if (!checkKorea(userDTO.value.userName)) {
        // 한글 유효성 검사
        printWarn(id, "Please input name only Korea");
        nameValid.value = false;
    } else {
        printPass(id, "Good");
        nameValid.value = true;
    }
};

// id 입력 유효성 검사
const inputId = (): void => {
    const id = "warn-id";
    checkDuplicate.value = false;
    if (!checkSpace(userDTO.value.userId)) {
        // 공백 검사
        printWarn(id, "Please do not input space");
        idValid.value = false;
    } else if (!checkLength(userDTO.value.userId, 4, 20)) {
        // 길이 검사
        printWarn(id, "Please input id at least 4 to 20");
        idValid.value = false;
    } else if (!checkPassword(userDTO.value.userId)) {
        // id 영어 숫자 포함 유효성
        printWarn(id, "Please input id english and number");
        idValid.value = false;
    } else {
        if (checkDuplicate.value) {
            printPass(id, "Good");
            idValid.value = true;
        } else {
            printWarn(id, "Please check id duplication");
            idValid.value = false;
        }

    }
};

// pw 입력 유효성 검사
const inputPw = (): void => {
    const id = "warn-pw";
    if (!checkSpace(userDTO.value.userPw)) {
        // 공백 검사
        printWarn(id, "Please do not input space");
        pwValid.value = false;
    } else if (!checkLength(userDTO.value.userPw, 8, 20)) {
        // 길이 검사
        printWarn(id, "Please input id at least 8 to 20");
        pwValid.value = false;
    } else if (!checkPassword(userDTO.value.userPw)) {
        // id 영어 숫자 포함 유효성
        printWarn(id, "Please input id english and number");
        pwValid.value = false;
    } else {
        printPass(id, "Good");
        pwValid.value = true;
    }
};

// check pw 유효성 검사
const inputCheckPw = (): void => {
    const id = "warn-check-pw";

    if (checkPw.value === userDTO.value.userPw) {
        printPass(id, "Good");
        checkPwValid.value = true;
        return;
    }

    if (!checkSpace(checkPw.value)) {
        // 공백 검사
        printWarn(id, "Please do not input space");
        checkPwValid.value = false;
    } else if (!checkLength(checkPw.value, 8, 20)) {
        // 길이 검사
        printWarn(id, "Please input id at least 8 to 20");
        checkPwValid.value = false;
    } else if (checkPw.value !== userDTO.value.userPw) {
        // 이전에 입력한 패스워드와 값이 같은지 비교
        printWarn(id, "Not same password and check-password");
        checkPwValid.value = false;
    }
};

// 입력 창 포커스 이동
const moveFocus = (id: string): void => {
    const el = document.getElementById(id);
    el!.focus();
};

// 확인 버튼 클릭 시 최종 유효성 검사
const inputCheckValid = (): boolean => {
    if (!nameValid.value) {
        alert("Please check name valid");
        moveFocus("input_name");
        return false;
    }

    if (!idValid.value) {
        alert("Please check id valid");
        moveFocus("input_id");
        return false;
    }

    if (!checkDuplicate.value) {
        alert("Check id duplication");
        return false;
    }

    if (!pwValid.value) {
        alert("Please check pw valid");
        moveFocus("input_pw");
        return false;
    }

    if (!checkPwValid.value) {
        alert("Please check check-pw valid");
        moveFocus("input_check_pw");
        return false;
    }

    return true;
};

// 모달창 닫기
const close = (): void => {
    emit("registerModal", false);
};

// ID 중복 검사
const doDuplicate = async () => {
    if (userDTO.value.userId === "") {
        alert("Please Input Id !");
        return;
    }

    await Axios.post<boolean>("/user/id/duplicate", {
        userId: userDTO.value.userId,
    })
        .then((res: any) => {
            if (!res.data) {
                checkDuplicate.value = true;
                printPass("warn-id", "Good");
                idValid.value = true;
            }
        })
        .catch((error: any) => console.log(error));
};
</script>
