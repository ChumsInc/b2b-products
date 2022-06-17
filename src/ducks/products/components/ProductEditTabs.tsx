import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    selectCurrentTab,
    Tab,
    TabList,
    tabListCreatedAction,
    tabSelectedAction,
    tabToggleStatusAction
} from "chums-ducks";
import {TabMap} from "../../../app/types";
import {selectCurrentProduct} from "../selectors";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_VARIANTS} from "../constants";

export const productEditTabsKey = 'product-edit-tabs';

export interface ProductTabMap extends TabMap {
    details: Tab,
    variant: Tab,
    json: Tab,
    colors: Tab,
    mix: Tab,
    images: Tab,

}

export const productTabs: ProductTabMap = {
    details: {id: 'details', title: 'Details'},
    variant: {id: 'variant', title: 'Variant',},
    colors: {id: 'colors', title: 'Colors'},
    mix: {id: 'mix', title: 'Mix'},
    images: {id: 'images', title: 'Images'},
    json: {id: 'json', title: 'Data'},
}

const tabList: Tab[] = [
    productTabs.details,
    productTabs.variant,
    productTabs.colors,
    productTabs.mix,
    productTabs.images,
    productTabs.json,
];

const ProductEditTabs: React.FC = () => {
    const dispatch = useDispatch();
    const currentProduct = useSelector(selectCurrentProduct);
    const currentTab = useSelector(selectCurrentTab(productEditTabsKey));

    useEffect(() => {
        dispatch(tabListCreatedAction(tabList, productEditTabsKey, productTabs.details.id))
    }, [])

    useEffect(() => {
        dispatch(tabToggleStatusAction(productTabs.variant.id, productEditTabsKey, currentProduct.sellAs == SELL_AS_VARIANTS));
        dispatch(tabToggleStatusAction(productTabs.mix.id, productEditTabsKey, currentProduct.sellAs == SELL_AS_MIX));
        dispatch(tabToggleStatusAction(productTabs.colors.id, productEditTabsKey, currentProduct.sellAs == SELL_AS_COLORS));
        dispatch(tabToggleStatusAction(productTabs.variant.id, productEditTabsKey, currentProduct.sellAs == SELL_AS_VARIANTS));
        if (currentProduct.sellAs === SELL_AS_VARIANTS && [productTabs.mix.id, productTabs.colors.id].includes(currentTab)) {
            dispatch(tabSelectedAction(productTabs.variant.id, productEditTabsKey));
        } else if (currentProduct.sellAs === SELL_AS_MIX && [productTabs.variant.id, productTabs.colors.id].includes(currentTab)) {
            dispatch(tabSelectedAction(productTabs.mix.id, productEditTabsKey));
        } else if (currentProduct.sellAs === SELL_AS_COLORS && [productTabs.mix.id, productTabs.variant.id].includes(currentTab)) {
            dispatch(tabSelectedAction(productTabs.colors.id, productEditTabsKey));
        }

    }, [currentProduct.sellAs])

    return (
        <TabList tabKey={productEditTabsKey}/>
    )
}

export default ProductEditTabs;
