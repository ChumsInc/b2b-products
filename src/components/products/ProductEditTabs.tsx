import React from 'react';
import {Tab} from "chums-components";
import {useAppSelector} from "../app/hooks";
import {generatePath, NavLink, useMatch} from "react-router";
import {Product} from "b2b-types/src/products";
import {isSellAsColors, isSellAsMix, isSellAsVariants} from "../../utils";
import {selectCurrentProduct} from "../../ducks/products/product/selectors";
import classNames from "classnames";
import {Nav} from "react-bootstrap";


export interface ProductTab extends Omit<Tab, 'title' | 'disabled'> {
    title: (arg?: Product | null) => string;
    disabled: (arg?: Product | null) => boolean;
}

const tabs: ProductTab[] = [
    // {id: 'details', title: () => 'Details', disabled: (arg) => !arg?.id},
    // {
    //     id: 'colors',
    //     title: (arg) => arg && isSellAsColors(arg) ? `Colors  (${arg.items.length})` : 'Colors',
    //     disabled: (arg) => !arg?.id || !isSellAsColors(arg)
    // },
    // {id: 'mix', title: () => 'Mix', disabled: (arg) => !arg?.id || !isSellAsMix(arg)},
    // {id: 'images', title: (arg) => `Images (${arg?.images?.length})`, disabled: (arg) => !arg?.id},
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
        <Nav variant="tabs" className="mb-3" activeKey={match?.params.tab ?? 'products'}>
            <Nav.Item className="nav-item">
                <Nav.Link as={NavLink} to={product?.id ? buildPath() : '/products'} eventKey="products"
                          end>Main</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to={buildPath('details')} eventKey="details" disabled={!product?.id}>
                    Details
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to={buildPath('variants')} eventKey="variants"
                          disabled={!product?.id || !isSellAsVariants(product)}>
                    <div>
                        Variants
                        {!!product && isSellAsVariants(product) && (
                            <span className="ms-1">({product.variants.filter(v => v.status).length})</span>
                        )}
                    </div>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to={buildPath('colors')} eventKey="colors"
                          disabled={!product?.id || !isSellAsColors(product)}>
                    <div>
                        Colors
                        {!!product && isSellAsColors(product) && product.items.length > 0 && (
                            <span className="ms-1">
                                ({product.items.filter(item => item.status).length}
                                /{product.items.length})
                            </span>
                        )}
                    </div>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to={buildPath('mix')} eventKey="mix"
                          disabled={!product?.id || !isSellAsMix(product)}>
                    Mix
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to={buildPath('images')} eventKey="images" disabled={!product?.id}>
                    <div>
                        Images
                        {/*{value?.images?.length > 0 && (*/}
                        {/*    <span className="ms-1">*/}
                        {/*        ({value.images?.filter(img => img.status)?.length}*/}
                        {/*        /{value.images?.length})*/}
                        {/*    </span>*/}
                        {/*)}*/}
                    </div>
                </Nav.Link>
            </Nav.Item>

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
        </Nav>
    )
}

export default ProductEditTabs;
