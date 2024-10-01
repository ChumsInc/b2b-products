import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from 'react';
import {Editable, ProductMixComponent} from "b2b-types";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {saveMixComponent} from "../../../ducks/products/mix/actions";
import {selectCurrentMixBOMDetail} from "../../../ducks/products/mix/selectors";
import {BOMComponent} from "../../../types/item-search";
import classNames from "classnames";
import Decimal from "decimal.js";

export interface ProductMixComponentRowProps {
    productId: number;
    component: ProductMixComponent,
}

const ProductMixComponentRow = ({productId, component}: ProductMixComponentRowProps) => {
    const dispatch = useAppDispatch();
    const bomDetail = useAppSelector(selectCurrentMixBOMDetail);
    const [comp, setComp] = useState<ProductMixComponent & Editable>({...component});
    const [bomComp, setBOMComp] = useState<BOMComponent|null>(null);
    const id = useId();

    useEffect(() => {
        setComp({...component});
    }, [component]);

    useEffect(() => {
        const [bomComponent] = bomDetail.filter(row => row.ComponentItemCode === component.itemCode);
        setBOMComp(bomComponent ?? null);
    }, [component, bomDetail]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setComp({...comp, itemQuantity: ev.target.valueAsNumber, changed: true})
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!productId) {
            return;
        }
        dispatch(saveMixComponent({productId, component: comp}));
    }

    const buttonClassName = classNames('btn btn-sm', {
        'btn-primary': new Decimal(bomComp?.QuantityPerBill ?? 0).eq(comp.itemQuantity ?? 0) && comp.changed,
        'btn-outline-primary': new Decimal(bomComp?.QuantityPerBill ?? 0).eq(comp.itemQuantity ?? 0) && !comp.changed,
        'btn-outline-danger': !new Decimal(bomComp?.QuantityPerBill ?? 0).eq(comp.itemQuantity ?? 0),
    })
    return (

        <tr key={comp.id}>
            <td>{comp.itemCode}</td>
            <td>{comp.color?.code}</td>
            <td>{comp.color?.name}</td>
            <td>
                <form onSubmit={submitHandler} id={id}>
                    <input type="number" className="form-control form-control-sm" min={0}
                           value={comp.itemQuantity}
                           onChange={changeHandler}/>
                </form>
            </td>
            <td>
                <button type="button" className={buttonClassName} disabled={!comp.changed}
                        form={id}
                        onClick={submitHandler}>
                    Save
                </button>
            </td>
        </tr>
    )
}

export default ProductMixComponentRow;
