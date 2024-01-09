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

export interface BOMHeader {
    BillNo: string;
    BillType: string;
    BillDesc1: string;
    BillDesc2: string;
    DateLastUsed: string|null;
    DateUpdated: string|null;
    SalesUnitOfMeasure: string;
    SalesUMConvFctr: number;
}
export interface BOMComponent {
    BillNo: string;
    LineKey: string;
    LineSeqNo: string;
    ComponentItemCode: string;
    ComponentDesc: string|null;
    QuantityPerBill: number|string;
}

export interface BOMResult {
    billHeader: BOMHeader[];
    billDetail: BOMComponent[];
}
