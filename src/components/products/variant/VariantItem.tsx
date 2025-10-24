import classNames from "classnames";
import ProductSellAsIcon from "@/components/products/list/ProductSellAsIcon.tsx";
import styled from "@emotion/styled";
import type {ProductVariant} from "b2b-types";
import {useAppDispatch} from "@/app/configureStore.ts";
import {setCurrentVariant} from "@/ducks/products/productVariantsSlice.ts";
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import type {Variant} from "react-bootstrap/types";
import type {MouseEvent} from "react";

const SortableItem = styled.div`
    flex: 1 1 auto;
    width: 100%;
    margin: 0.25rem 0.5rem;
    //text-align: center;
    font-size: small;
    flex-direction: row;
    display: flex;
    align-items: center;
    max-width: 100%;
`

export interface VariantItemProps {
    variant: ProductVariant,
    active?: boolean,
}

function getButtonVariant(variant: ProductVariant, active?: boolean):Variant {
    if (variant.isDefaultVariant) {
        return active ? 'primary' : 'outline-primary';
    }
    return active ? 'secondary' : 'outline-secondary';
}
export default function VariantItem({variant, active}:VariantItemProps) {
    const dispatch = useAppDispatch();
    const [btnVariant, setBtnVariant] = useState<Variant>(getButtonVariant(variant, active));

    useEffect(() => {
        setBtnVariant(getButtonVariant(variant, active))
    }, [variant, active]);

    const clickHandler = (ev:MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        dispatch(setCurrentVariant(variant));
    }

    return (
        <SortableItem>
            <span className="text-secondary" style={{flex: '0 0 3rem'}}>{variant.id}</span>
            <Button type="button" size="sm" variant={btnVariant} onClick={clickHandler} className="me-3">
                Edit
            </Button>
            <div className={classNames('text-start', {'text-primary': variant.isDefaultVariant,})}
                 style={{flex: '0 0 8rem'}}>
                <div>
                    {variant.title}
                    {variant.product && (
                        <ProductSellAsIcon product={variant.product} style={{display: 'inline-block'}}
                                           className="ms-1"/>)}
                </div>
                {(!variant.status || !variant.product?.status) && (
                    <span className="ms-1 bi-exclamation-triangle-fill text-warning"/>
                )}
            </div>
            <div style={{flex: '1 1 auto'}}>{variant.product?.keyword}</div>
            <div style={{flex: '0 0 auto'}} className="text-end">{variant.product?.itemCode}</div>
        </SortableItem>
    )
}
