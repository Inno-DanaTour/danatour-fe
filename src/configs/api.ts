const BASE_URL = 'http://localhost:8080/api/v1';

export const getToken = () => localStorage.getItem('token');

export const parseJwt = (token: string) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(""),
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    const payload = parseJwt(token);
    return payload ? payload.userId : null;
};

const getHeaders = (isMultipart: boolean = false) => {
    const headers: any = {
        Accept: "application/json",
    };
    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (!isMultipart) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
};

export const api = {
    get: async <T>(endpoint: string, options?: { params?: any }): Promise<T> => {
        let url = `${BASE_URL}${endpoint}`;
        if (options?.params) {
            const params = new URLSearchParams();
            Object.entries(options.params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            });
            const queryString = params.toString();
            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({message: "An error occurred"}));
            throw new Error(error.message || "Network response was not ok");
        }
        return response.json();
    },

    post: async <T>(endpoint: string, data: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({message: "An error occurred"}));
            throw new Error(error.message || "Network response was not ok");
        }
        return response.json();
    },

    postMultipart: async <T>(
        endpoint: string,
        formData: FormData,
    ): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: getHeaders(true),
            body: formData,
        });
        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({message: "An error occurred"}));
            throw new Error(error.message || "Network response was not ok");
        }
        return response.json();
    },

    put: async <T>(endpoint: string, data?: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({message: "An error occurred"}));
            throw new Error(error.message || "Network response was not ok");
        }
        return response.json();
    },

    putMultipart: async <T>(endpoint: string, formData: FormData): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: formData,
        });
        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({message: "An error occurred"}));
            throw new Error(error.message || "Network response was not ok");
        }
        return response.json();
    },

    patch: async <T>(endpoint: string, data?: any, options?: { params?: any }): Promise<T> => {
        let url = `${BASE_URL}${endpoint}`;
        if (options?.params) {
            const queryString = new URLSearchParams(options.params as Record<string, string>).toString();
            url += `?${queryString}`;
        }
        const response = await fetch(url, {
            method: 'PATCH',
            headers: getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({message: 'An error occurred'}));
            throw new Error(error.message || 'Network response was not ok');
        }
        return response.json();
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({message: "An error occurred"}));
            throw new Error(error.message || "Network response was not ok");
        }
        return response.json();
    },
};
