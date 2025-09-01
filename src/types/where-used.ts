export interface WhereUsed {
    id: number;
    keyword: string;
    active: boolean;
}

export interface WhereUsedResponse {
    products?: WhereUsed[];
    categoryPages?: WhereUsed[];
}
