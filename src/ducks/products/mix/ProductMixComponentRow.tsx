import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from 'react';
import {ProductMixComponent} from "b2b-types";
import {EditableProductMixComponent} from "../../../types/product";
import {useAppDispatch} from "../../../app/hooks";
import {saveMixComponent} from "./actions";

export interface ProductMixComponentRowProps {
    productId: number;
    component: ProductMixComponent,
}

const ProductMixComponentRow = ({productId, component}: ProductMixComponentRowProps) => {
    const dispatch = useAppDispatch();
    const [comp, setComp] = useState<EditableProductMixComponent>({...component});
    const id = useId();

    useEffect(() => {
        setComp({...component});
    }, [component]);

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

    return (

        <tr key={comp.id}>
            <td>{comp.itemCode}</td>
            <td>{comp.color?.code}</td>
            <td>
                <form onSubmit={submitHandler} id={id}>
                    <input type="number" className="form-control form-control-sm" min={0}
                           value={comp.itemQuantity}
                           onChange={changeHandler}/>
                </form>
            </td>
            <td>
                <button type="button" className="btn btn-sm btn-outline-primary" disabled={!comp.changed}
                        form={id}
                        onClick={submitHandler}>
                    Save
                </button>
            </td>
        </tr>
    )
}

export default ProductMixComponentRow;
