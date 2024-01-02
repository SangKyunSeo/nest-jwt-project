import router from "@/router";
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

const axiosConfig: AxiosRequestConfig = {
    baseURL: "http://localhost:3000/api/",
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    withCredentials: true,
};

export class AxiosI {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create(axiosConfig);
    }

    // 전체 에러
    onError = (status: number, message: string) => {
        const error = { status, message };
        alert(error.message);
        if (error.message === "쿠키 만료") router.push("/");
        throw error;
    };

    // Axios 요청
    onRequest = (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        const { method, url } = config;
        console.log(`method : ${method}, url : ${url}`);

        return Promise.resolve({ ...config } as InternalAxiosRequestConfig);
    };

    // Axios 요청 에러
    onErrorRequest = (error: AxiosError<AxiosRequestConfig>) => {
        console.log(`Request Error : ${error}`);
        return Promise.reject(error);
    };

    // Axios 응답
    onResponse = async (response: AxiosResponse): Promise<AxiosResponse> => {
        console.log("Axios response : " + response.status);
        const { method, url } = response.config;
        const { status } = response;

        console.log(`Response config : ${response.config}`);
        console.log(`method : ${method}, url : ${url}, status : ${status}`);
        console.log(response);

        return response;
    };

    // Axios 응답 에러
    onErrorResponse = async (error: AxiosError | Error) => {
        if (axios.isAxiosError(error)) {
            const { method, url } = error.config as AxiosRequestConfig;
            const { status, statusText, data } = error.response as AxiosResponse;
            const { message } = data;
            console.log(
                `message : ${message}, method : ${method}, url : ${url}, status : ${status}, statusText : ${statusText}`
            );

            switch (status) {
                case 400:
                    this.onError(status, "잘못된 요청");
                    break;
                case 401:
                    if (message === "Login information does not match") this.onError(status, "로그인 정보가 없습니다.");
                    else if (message === "Cookie is expired") throw Error("쿠키 만료");
                    else {
                        // Access Token 만료시에 대한 처리
                        console.log("인터셉터 응답 오류 체크 ");
                        const originRequest = error.config as AxiosRequestConfig;
                        return await this.instance
                            .get("/auth/refresh")
                            .then((res) => {
                                console.log("Axios interceptor res : " + res.data);
                                if (res.data) {
                                    return this.instance(originRequest);
                                }
                            })
                            .catch((error) => {
                                console.log(error.message);
                                if (error.message === "쿠키 만료") {
                                    this.onError(status, error.message);
                                } else this.onError(status, "토큰 만료");
                            });
                    }
                    break;
                case 403:
                    this.onError(status, "권한 없음");
                    break;
                case 404:
                    this.onError(status, "찾을 수 없는 페이지");
                    break;
                case 500:
                    this.onError(status, "서버 오류");
                    break;
                default:
                    this.onError(status, `에러발생 : ${error.message}`);
            }
        } else if (error instanceof Error && error.name === "TimeoutError") {
            console.log(`TimeError : ${error.toString()}`);
            this.onError(0, "요청 시간 초과");
        } else {
            console.log(`Error : ${error.toString()}`);
            this.onError(0, `Error 발생 : ${error.toString()}`);
        }

        return Promise.reject(error);
    };

    setupInterceptors = (): AxiosInstance => {
        this.instance.interceptors.request.use(this.onRequest, this.onErrorRequest);
        this.instance.interceptors.response.use(this.onResponse, this.onErrorResponse);

        return this.instance;
    };
}
