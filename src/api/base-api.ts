import {createApi, fetchBaseQuery, retry} from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
    baseUrl: '/',
    credentials: 'same-origin',
})

const baseQueryWithRetry = retry(baseQuery, {maxRetries: 2});

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithRetry,
    tagTypes: ['ItemSearch'],
    endpoints: () => ({})
})
