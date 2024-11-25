import React from 'react';
import {useAppSelector} from "../app/hooks";
import {generatePath, NavLink, useMatch} from "react-router";
import {isSellAsColors, isSellAsMix, isSellAsVariants} from "../../utils";
import {selectCurrentProduct} from "../../ducks/products/product/selectors";
import {Nav} from "react-bootstrap";

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
                        {!!product?.images?.length && (
                            <span className="ms-1">
                                ({product.images?.filter(img => img.status)?.length}
                                /{product.images?.length})
                            </span>
                        )}
                    </div>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to={buildPath('json')} eventKey="json" disabled={!product?.id}>
                    Data
                </Nav.Link>
            </Nav.Item>
        </Nav>
    )
}

export default ProductEditTabs;
