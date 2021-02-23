import { useEffect, useCallback, useReducer } from "react";
import { server } from "../lib/api";

interface IState<TData> {
    "data": TData | null;
    "loading": boolean;
    "error": boolean;
}

interface QueryResult<TData> extends IState<TData> {
    refetch: () => void;
}

type Action<TData> = 
    | { "type": "FETCH" }
    | { "type": "FETCH_SUCCESS", "payload": TData }
    | { "type": "FETCH_ERROR" };

const reducer = <TData>() => (
    state: IState<TData>, 
    action: Action<TData>
): IState<TData> => {
    switch (action.type) {
        case "FETCH":
            return { ...state, "loading": true };
        case "FETCH_SUCCESS":
            return {
                "data": action.payload,
                "loading": false,
                "error": false,
            };
        case "FETCH_ERROR":
            return { ...state, "loading": false, "error": true };
        default:
            return state;
    }
};

export const useQuery = <TData = any>(
    query: string
): QueryResult<TData> => {
    const fetchReducer = reducer<TData>();
    const [state, dispatch] = useReducer(fetchReducer, { 
        "data": null, 
        "loading": false,
        "error": false,
    });

    const fetchApi = useCallback(async () => {
        try {
            dispatch({ "type": "FETCH"});
            const { data, errors } = await server.fetch<TData>({ query });

            if (errors && errors.length) throw new Error(errors[0].message);

            dispatch({ "type": "FETCH_SUCCESS", "payload": data });
        } catch (error) {
            dispatch({ "type": "FETCH_ERROR" });
            throw console.error(error);
        }
    }, [query]);

    useEffect(() => {
        fetchApi()
    }, [fetchApi]);

    return { ...state, refetch: fetchApi };
};
