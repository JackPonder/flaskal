import type { HttpMethod } from "@sveltejs/kit";
import { API_BASE_URL } from "$env/static/private";

type RequestOptions = {
    method?: HttpMethod;
    path?: string;
    query?: Record<string, string>;
    authorization?: string;
    body?: object;
};

export const api = {
    request: async (options: RequestOptions) => {
        const queryParams = options.query ? "?" + new URLSearchParams(options.query).toString() : "";
        let response: Response;

        try {
            response = await fetch(API_BASE_URL + options.path + queryParams, {
                method: options.method,
                headers: {
                    "content-type": "application/json",
                    "authorization": options.authorization ?? "",
                },
                body: JSON.stringify(options.body)
            });
        } catch (e: any) {
            return {
                ok: false,
                status: 500,
                body: { error: e.message },
            };
        }
    
        const json = response.status !== 204 ? await response.json() : null;
        return {
            ok: response.ok,
            status: response.status,
            body: json,
        };
    },
    
    get: async (path: string, options?: RequestOptions) => {
        return api.request({ method: "GET", path, ...options });
    },
    
    post: async (path: string, body?: object, options?: RequestOptions) => {
        return api.request({ method: "POST", path, body, ...options });
    },

    put: async (path: string, body?: object, options?: RequestOptions) => {
        return api.request({ method: "PUT", path, body, ...options });
    },
    
    patch: async (path: string, body?: object, options?: RequestOptions) => {
        return api.request({ method: "PATCH", path, body, ...options });
    },
    
    delete: async (path: string, options?: RequestOptions) => {
        return api.request({ method: "DELETE", path, ...options });
    },
}