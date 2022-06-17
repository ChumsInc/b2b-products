export interface ItemSearchRecord {
    company: string,
    ItemCode: string,
    ItemCodeDesc: string,
    ProductType: string,
    LabelKey: string,
}

export interface ItemSearchFilter {
    productType?: string,
    productLine?: string,
    category?: string,
    subCategory?: string,
    baseSKU?: string,
}

export interface ItemSearchList {
    [key:string]:ItemSearchRecord
}
