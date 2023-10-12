import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Logger } from '@nestjs/common';

export const axiosLogger = new Logger('axios');

export const setupAxiosInterceptors = () => {
    requestStartedAtInterceptor();
    requestLoggerInterceptor();
};

type EnrichedAxiosRequestConfig = InternalAxiosRequestConfig & { meta: { requestStartedAt: number } };

const requestStartedAtInterceptor = () => {
    axios.interceptors.request.use((config: EnrichedAxiosRequestConfig) => {
        config.meta = config.meta || {};
        config.meta.requestStartedAt = new Date().getTime();
        return config;
    });
};

function requestLoggerInterceptor() {
    axios.interceptors.response.use(
        (response) => {
            const method = response.config.method?.toUpperCase();
            const url = response.config.url;
            const respStatus = response.status;
            const stringifyRespData = JSON.stringify(response.data);
            const respTimeMs =
                new Date().getTime() - (response.config as EnrichedAxiosRequestConfig).meta.requestStartedAt;

            axiosLogger.log(
                `${method} ${url} successfully completed with ${respStatus} ${stringifyRespData} in ${respTimeMs} ms`,
            );
            return response;
        },
        (error: AxiosError) => {
            if (error.response) {
                const method = error.response.config.method?.toUpperCase();
                const url = error.response.config.url;
                const respStatus = error.response.status;
                const stringifyRespData = JSON.stringify(error.response.data);
                const stringifyReqData = JSON.stringify(error.response.config.data);
                const stringifyReqHeaders = JSON.stringify(error.response.config.headers);

                axiosLogger.error(
                    `${method} ${url} failed with ${respStatus} ${stringifyRespData}. Request body ${stringifyReqData}. Request headers ${stringifyReqHeaders}`,
                );
            }
            return Promise.reject(error);
        },
    );
}
