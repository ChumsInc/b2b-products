import {type ChangeEvent, type FormEvent, useEffect, useId, useState} from 'react';
import type {Editable, ProductMixComponent} from "b2b-types";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {saveMixComponent} from "@/ducks/products/actions/mix-actions.ts";
import {selectCurrentMixBOMDetail} from "@/ducks/products/productMixBOMSlice";
import type {BOMComponent} from "@/types/item-search";
import classNames from "classnames";
import Decimal from "decimal.js";
import {FormControl, InputGroup} from "react-bootstrap";

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
        'btn-primary': new Decimal(bomComp?.QuantityPerBill ?? 0).eq(comp.itemQuantity ?? 0),
        'btn-danger': !new Decimal(bomComp?.QuantityPerBill ?? 0).eq(comp.itemQuantity ?? 0),
    })

    const rowClassName = classNames({
        'table-danger': !bomComp
    })
    return (

        <tr key={comp.id} className={rowClassName}>
            <td>{comp.itemCode}</td>
            <td>{comp.color?.code}</td>
            <td>{comp.color?.name}</td>
            <td>
                <form onSubmit={submitHandler} id={id}>
                    <InputGroup size="sm">
                        <FormControl type="number" size="sm" className="text-end" min={0}
                                     value={comp.itemQuantity} onChange={changeHandler}/>
                        <InputGroup.Text>
                            {comp.itemQuantity === +(bomComp?.QuantityPerBill ?? 0) && (
                                <span className="bi-check text-success"/>
                            )}
                            {comp.itemQuantity !== +(bomComp?.QuantityPerBill ?? 0) && (
                                <span className="bi-exclamation-triangle text-danger me-1"/>
                            )}
                        </InputGroup.Text>
                        {comp.itemQuantity !== +(bomComp?.QuantityPerBill ?? 0) && (
                            <InputGroup.Text className="text-danger">
                                {bomComp?.QuantityPerBill ?? 0}
                            </InputGroup.Text>
                        )}

                    </InputGroup>
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
