export class ApiError extends Error {
    constructor(message, options = {}) {
        super(message || 'Something went wrong. Please try again.');
        this.name = 'ApiError';
        this.status = options.status;
        this.code = options.code;
        this.details = options.details;
    }
}

export const apiFetch = async (url, options = {}) => {
    const finalOptions = {
        // Always send/receive cookies for cross-origin API calls
        credentials: 'include',
        ...options,
    };

    let response;
    try {
        response = await fetch(url, finalOptions);
    } catch (networkErr) {
        throw new ApiError('Unable to reach the server. Please check your connection and try again.', {
            code: 'NETWORK_ERROR',
        });
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        // Non‑JSON response; keep data as null
    }

    if (!response.ok) {
        const message =
            data?.message ||
            (response.status >= 500
                ? 'We are having trouble on our side. Please try again in a moment.'
                : 'We could not complete that action. Please review and try again.');

        throw new ApiError(message, {
            status: response.status,
            code: data?.code,
            details: data,
        });
    }

    return data;
};

