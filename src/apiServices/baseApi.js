
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://saas.genefied.in/' }),
    endpoints: () => ({
      
      }),
    })
  
    
    
    
    // https://saas.genefied.in/
    // http://saas-api-dev.genefied.in/