import {SorterProps} from "chums-connected-components";
import {
    ColorProductUsage,
    Product,
    ProductColor,
    ProductColorItem,
    ProductListItem,
    ProductMixComponent,
    ProductMixItem,
    ProductSeason,
    ProductVariant, SellAsColorsProduct, SellAsMixProduct, SellAsVariantsProduct
} from "b2b-types/src/products";
import {Editable} from "./generics";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_SELF, SELL_AS_VARIANTS, SellAsSelfProduct} from "b2b-types";
import {WritableDraft} from "immer/dist/types/types-external";

export interface EditableProductColor extends ProductColor, Editable {
}

export interface EditableSellAsSelfProduct extends SellAsSelfProduct, Editable {}
export interface EditableSellAsVariantsProduct extends SellAsVariantsProduct, Editable {}
export interface EditableSellAsMixProduct extends SellAsMixProduct, Editable {}
export interface EditableSellAsColorsProduct extends SellAsColorsProduct, Editable {}

// export type EditableProduct = EditableSellAsSelfProduct | EditableSellAsVariantsProduct | EditableSellAsMixProduct | EditableSellAsColorsProduct;
export type EditableProduct = Product & Editable;

export interface EditableVariant extends ProductVariant, Editable {
}

export interface EditableProductColorItem extends ProductColorItem, Editable {
}

export interface EditableProductMixItem extends ProductMixItem, Editable {
}

export interface EditableProductMixComponent extends ProductMixComponent, Editable {
}

export type BooleanLike = boolean | 1 | 0;

export type SortableColor = Omit<ProductColor, 'changed' | 'active'>

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
    [key: string]: ProductListItem,
}

export interface ProductSeasonList {
    [key: string]: ProductSeason,
}

export interface ProductListSorterProps extends SorterProps {
    field: keyof ProductListItem,
}

export interface ProductVariantListSorterProps extends SorterProps {
    field: keyof ProductVariant,
}

export function isSellAsSelfProduct(product:Product): product is SellAsSelfProduct {
    return (product as SellAsSelfProduct).sellAs === SELL_AS_SELF;
}

