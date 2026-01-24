import { baseApi } from "./baseApi";

const parantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllParents: builder.query({
      query: ({ search, page, limit }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);

        return {
          url: `/parents?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["parents"],
    }),



    getAllTutors: builder.query({
      query: ({ search, page, limit }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);

        return {
          url: `/tutors?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["tutors"],
    }),

    addTutors: builder.mutation({
      query: (data) => {
        return {
          url: "/tutors",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["tutors"],
    }),

    updateTutor: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/tutors/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["tutors"],
    }),

    deleteTutor: builder.mutation({
      query: (id) => {
        return {
          url: `/tutors/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["tutors"],
    }),



 addPackage: builder.mutation({
      query: (data) => {
        return {
          url: "/packages",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["tutors"],
    }),
getAllPackages: builder.query({
      query: () => {
        return {
          url: `/packages`,
          method: "GET",
        };
      },
      providesTags: ["tutors"],
    }),

     deletePackages: builder.mutation({
      query: (id) => {
        return {
          url: `/packages/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["tutors"],
    }),


  }),
});

export const { useGetAllParentsQuery, useAddTutorsMutation, useDeleteTutorMutation, useGetAllTutorsQuery, useUpdateTutorMutation , useAddPackageMutation, useGetAllPackagesQuery, useDeletePackagesMutation} = parantsApi;
