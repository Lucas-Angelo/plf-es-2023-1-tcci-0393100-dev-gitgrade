export type PartialSome<T, K extends keyof T> = Partial<Pick<T, K>> &
    Omit<T, K>;

export type RequiredSome<T, K extends keyof T> = Required<Pick<T, K>> &
    Omit<T, K>;
