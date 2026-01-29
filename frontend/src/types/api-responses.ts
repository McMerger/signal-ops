export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    total?: number;
    page?: number;
    pageSize?: number;
}

export interface ApiError {
    error: string;
    message?: string;
    statusCode?: number;
}
