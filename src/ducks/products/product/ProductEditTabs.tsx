import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {ConnectedTabs, selectCurrentTab, tabSelectedAction, tabToggleStatusAction} from "chums-connected-components";
import {TabMap} from "../../../app/types";
import {selectCurrentProduct} from "./selectors";
import {Tab} from "chums-components";
import {isSellAsColorsProduct, isSellAsMixProduct, isSellAsVariantsProduct} from "../utils";
import {SellAsColorsProduct, SellAsMixProduct, SellAsVariantsProduct} from "b2b-types";
import {useAppDispatch} from "../../../app/hooks";

export const productEditTabsKey = 'product-edit-tabs';

export interface ProductTabMap extends TabMap {
    main: Tab,
    details: Tab,
    variant: Tab,
    json: Tab,
    colors: Tab,
    mix: Tab,
    images: Tab,

}

export const productTabs: ProductTabMap = {
    main: {id: 'main', title: 'Main'},
    details: {id: 'details', title: 'Details'},
    variant: {id: 'variant', title: 'Variant',},
    colors: {id: 'colors', title: 'Colors'},
    mix: {id: 'mix', title: 'Mix'},
    images: {id: 'images', title: 'Images'},
    json: {id: 'json', title: 'Data'},
}

const tabList: Tab[] = [
    productTabs.main,
    productTabs.details,
    productTabs.variant,
    productTabs.colors,
    productTabs.mix,
    productTabs.images,
    productTabs.json,
];

const ProductEditTabs: React.FC = () => {
    const dispatch = useAppDispatch();
    const currentProduct = useSelector(selectCurrentProduct);
    const currentTab = useSelector(selectCurrentTab(productEditTabsKey));


    useEffect(() => {
        dispatch(tabToggleStatusAction(productTabs.variant.id, productEditTabsKey, isSellAsVariantsProduct(currentProduct as SellAsVariantsProduct)));
        dispatch(tabToggleStatusAction(productTabs.mix.id, productEditTabsKey, isSellAsMixProduct(currentProduct as SellAsMixProduct)));
        dispatch(tabToggleStatusAction(productTabs.colors.id, productEditTabsKey, isSellAsColorsProduct(currentProduct as SellAsColorsProduct)));

        if (isSellAsVariantsProduct(currentProduct as SellAsVariantsProduct) && [productTabs.mix.id, productTabs.colors.id].includes(currentTab)) {
            dispatch(tabSelectedAction(productTabs.variant.id, productEditTabsKey));
        } else if (isSellAsMixProduct(currentProduct as SellAsMixProduct) && [productTabs.variant.id, productTabs.colors.id].includes(currentTab)) {
            dispatch(tabSelectedAction(productTabs.mix.id, productEditTabsKey));
        } else if (isSellAsColorsProduct(currentProduct as SellAsColorsProduct) && [productTabs.mix.id, productTabs.variant.id].includes(currentTab)) {
            dispatch(tabSelectedAction(productTabs.colors.id, productEditTabsKey));
        }
    }, [currentProduct?.sellAs])

    return (
        <ConnectedTabs tabKey={productEditTabsKey} tabs={tabList} defaultTabId={productTabs.main.id} className="mb-1"/>
    )
}

export default ProductEditTabs;
