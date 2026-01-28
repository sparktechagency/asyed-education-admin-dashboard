import { baseApi } from "./baseApi";

const testimonialApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTestimonials: builder.query({
            query: () => ({
                url: "/testimonials",
                method: "GET",
            }),
            providesTags: ["Testimonials"],
        }),

        addTestimonial: builder.mutation({
            query: (data) => ({
                url: "/testimonials",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Testimonials"],
        }),

        updateTestimonial: builder.mutation({
            query: ({ id, data }) => ({
                url: `/testimonials/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Testimonials"],
        }),

        deleteTestimonial: builder.mutation({
            query: (id) => ({
                url: `/testimonials/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Testimonials"],
        }),
    }),
});

export const {
    useGetAllTestimonialsQuery,
    useAddTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,
} = testimonialApi;
