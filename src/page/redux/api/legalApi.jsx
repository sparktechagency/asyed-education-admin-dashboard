import { baseApi } from "./baseApi";



const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query({
            query: () => ({
                url: '/privacy-policy',
                method: 'GET'
            }),
            providesTags: ['legal']
        }),

     createPrivacyPolicy: builder.mutation({
            query: (data) => ({
                url: '/privacy-policy',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['legal']
        }),
     createTermsAndConditions: builder.mutation({
            query: (data) => ({
                url: '/terms-and-conditions',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['legal']
        }),
         getTermsAndConditions: builder.query({
            query: () => ({
                url: '/terms-and-conditions',
                method: 'GET'
            }),
            providesTags: ['legal']
        }),
    

  }),
});


export const 
 { 
    useGetPrivacyPolicyQuery,
    useCreatePrivacyPolicyMutation,
    useCreateTermsAndConditionsMutation,
    useGetTermsAndConditionsQuery
  } = legalApi;