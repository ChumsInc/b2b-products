import {SorterProps} from "chums-ducks";
import {
    Product,
    ProductColor,
    ColorProductUsage,
    ProductListItem,
    ProductSeason,
    ProductVariant, ProductColorVariant, ProductColorItem, ProductMixItem, ProductMixComponent
} from "b2b-types/src/products";

export interface Editable {
    changed?: boolean,
}

export interface EditableProductColor extends ProductColor, Editable {}

export interface EditableProduct extends Product, Editable {}
export interface EditableVariant extends ProductVariant, Editable {}
export interface EditableProductColorItem extends ProductColorItem, Editable {}
export interface EditableProductMixItem extends ProductMixItem, Editable {}
export interface EditableProductMixComponent extends ProductMixComponent, Editable {}

export type BooleanLike = boolean|1|0;

export type SortableColor = Omit<ProductColor, 'changed'|'active'>

export interface ColorSorterProps extends SorterProps {
    field: keyof SortableColor,
}
export type SortableColorProductUsage = Omit<ColorProductUsage, 'swatchCode' | 'image'>

export interface ColorProductSorterProps extends SorterProps {
    field: keyof SortableColorProductUsage
}

export type ProductImageSize = 80 | 125 | 250 | 400 | 800 | 2048;
export type ProductImagePath = '80' | '125' | '250' | '400' | '800' | '2048' | 'originals';


export interface ProductList {
    [key:string]: ProductListItem,
}

export interface ProductSeasonList {
    [key:string]: ProductSeason,
}

export interface ProductListSorterProps extends SorterProps {
    field: keyof ProductListItem,
}

export interface ProductVariantListSorterProps extends SorterProps {
    field: keyof ProductVariant,
}
