import React from 'react';
import {Tab} from "chums-components";
import {useAppSelector} from "../app/hooks";
import {useMatch, useNavigate} from "react-router";
import {generatePath, NavLink} from "react-router-dom";
import {Product} from "b2b-types/src/products";
import {isSellAsColors, isSellAsMix, isSellAsVariants} from "../../utils";
import {selectCurrentProduct} from "../../ducks/products/product/selectors";
import classNames from "classnames";


export interface ProductTab extends Omit<Tab, 'title' | 'disabled'> {
    title: (arg?: Product | null) => string;
    disabled: (arg?: Product | null) => boolean;
}

const tabs: ProductTab[] = [
    {id: 'details', title: () => 'Details', disabled: (arg) => !arg?.id},
    {
        id: 'variant',
        title: (arg) => arg && isSellAsVariants(arg) ? `Variants (${arg.variants.length})` : 'Variants',
        disabled: (arg) => !arg?.id || !isSellAsVariants(arg)
    },
    {
        id: 'colors',
        title: (arg) => arg && isSellAsColors(arg) ? `Colors  (${arg.items.length})` : 'Colors',
        disabled: (arg) => !arg?.id || !isSellAsColors(arg)
    },
    {id: 'mix', title: () => 'Mix', disabled: (arg) => !arg?.id || !isSellAsMix(arg)},
    {id: 'images', title: (arg) => `Images (${arg?.images?.length})`, disabled: (arg) => !arg?.id},
    {id: 'json', title: () => 'Data', disabled: (arg) => !arg?.id},
]

const ProductEditTabs = () => {
    const product = useAppSelector(selectCurrentProduct);
    const match = useMatch({path: '/products/:keyword/:tab?', end: false})

    const buildPath = (tab?: string): string => {
        if (!tab) {
            return generatePath('/products/:keyword', {keyword: match?.params.keyword ?? 'new'});
        }
        return generatePath('/products/:keyword/:tab', {
            keyword: match?.params.keyword ?? product?.keyword ?? '-',
            tab: tab ?? 'main'
        });
    }

    return (
        <ul className="nav nav-tabs mb-3">
            {!product?.id && (
                <li className="nav-item">
                    <NavLink to="/products" className="nav-link" end>Main</NavLink>
                </li>
            )}
            {!!product?.id && (
                <li className="nav-item">
                    <NavLink to={buildPath()} className="nav-link" end>Main</NavLink>
                </li>

            )}
            {tabs.map(tab => (
                <li className="nav-item" key={tab.id} id={tab.id} title={tab.title(product)}>
                    <NavLink to={buildPath(tab.id)} className={({isActive}) => classNames("nav-link", {
                        disabled: tab.disabled(product) ?? false,
                        active: isActive
                    })}>
                        {tab.title(product)}
                    </NavLink>
                </li>
            ))}
        </ul>
    )
}

export default ProductEditTabs;
