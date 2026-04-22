export interface ResponseWithData<T> {
    data: T;
}

export interface ResponseWithError {
    error: string;
}