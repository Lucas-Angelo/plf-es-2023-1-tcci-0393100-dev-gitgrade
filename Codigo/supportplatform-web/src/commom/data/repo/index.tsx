import { useQuery } from "@tanstack/react-query";
import { IGetAllRepoRequest, IGetAllRepoResponse } from "../../models/repo";
import { wait } from "../../utils/time";

const fakeArray = [
    { name: "bootstrap", evaluationMethodName: "Method A", id: 1 },
    { name: "react", evaluationMethodName: "Method B", id: 2 },
    { name: "tensorflow", evaluationMethodName: "Method C", id: 3 },
    { name: "vue", evaluationMethodName: "Method D", id: 4 },
    { name: "angular", evaluationMethodName: "Method E", id: 5 },
    { name: "swift", evaluationMethodName: "Method F", id: 6 },
    { name: "TypeScript", evaluationMethodName: "Method G", id: 7 },
    { name: "git", evaluationMethodName: "Method H", id: 8 },
    { name: "cli", evaluationMethodName: "Method I", id: 9 },
    { name: "kafka", evaluationMethodName: "Method J", id: 10 },
    { name: "express", evaluationMethodName: "Method K", id: 11 },
    { name: "django", evaluationMethodName: "Method L", id: 12 },
    { name: "laravel", evaluationMethodName: "Method M", id: 13 },
    { name: "spring-framework", evaluationMethodName: "Method N", id: 14 },
    { name: "flask", evaluationMethodName: "Method O", id: 15 },
    { name: "rails", evaluationMethodName: "Method P", id: 16 },
    { name: "angular.js", evaluationMethodName: "Method Q", id: 17 },
    { name: "ember.js", evaluationMethodName: "Method R", id: 18 },
    { name: "pandas", evaluationMethodName: "Method S", id: 19 },
    { name: "numpy", evaluationMethodName: "Method T", id: 20 },
    { name: "scikit-learn", evaluationMethodName: "Method U", id: 21 },
    { name: "tensorflow/models", evaluationMethodName: "Method V", id: 22 },
    { name: "keras", evaluationMethodName: "Method W", id: 23 },
    { name: "pytorch", evaluationMethodName: "Method X", id: 24 },
    { name: "openai/gpt-3", evaluationMethodName: "Method Y", id: 25 },
    { name: "babel", evaluationMethodName: "Method Z", id: 26 },
    { name: "webpack", evaluationMethodName: "Method AA", id: 27 },
    { name: "node", evaluationMethodName: "Method AB", id: 28 },
    { name: "express.js", evaluationMethodName: "Method AC", id: 29 },
    { name: "nestjs", evaluationMethodName: "Method AD", id: 30 },
    { name: "ruby", evaluationMethodName: "Method AE", id: 31 },
    { name: "rails/rails", evaluationMethodName: "Method AF", id: 32 },
    { name: "flutter", evaluationMethodName: "Method AG", id: 33 },
];

export const getRepoQuery = (filterOptions?: IGetAllRepoRequest) => ({
    queryKey: filterOptions ? ["repo", filterOptions] : ["repo"],
    queryFn: async () => {
        await wait(1000);
        const pageSize = 10;
        const start = ((filterOptions?.page ?? 1) - 1) * pageSize;
        const end = start + pageSize;
        return {
            totalPages: 4,
            results: fakeArray.slice(start, end),
        } as IGetAllRepoResponse;
    },
    staleTime: Number.MAX_VALUE,
});

export const useRepoList = (filterOptions?: IGetAllRepoRequest) =>
    useQuery(getRepoQuery(filterOptions));
