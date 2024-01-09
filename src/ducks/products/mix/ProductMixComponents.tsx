import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import {selectCurrentMix, selectCurrentMixComponents, selectCurrentMixStatus} from "./selectors";
import {ProductMixComponent} from "b2b-types/src/products";
import {defaultMixComponent} from "../../../defaults";
import ItemDataList from "../../item-search/ItemDataList";
import {saveMixComponent} from "./actions";
import ProductMixComponentRow from "./ProductMixComponentRow";
import {useAppDispatch} from "../../../app/hooks";
import ColorAutoComplete from "../../colors/ColorAutoComplete";
import {ProductColor} from "b2b-types";
import BOMDetail from "./BOMDetail";


const colWidth = 8;
const ProductMixComponents: React.FC = () => {
    const dispatch = useAppDispatch();
    const mix = useSelector(selectCurrentMix);
    const components = useSelector(selectCurrentMixComponents);
    const status = useSelector(selectCurrentMixStatus);
    const itemCodeRef = useRef<HTMLInputElement | null>(null)

    const [component, setComponent] = useState<ProductMixComponent>({
        ...defaultMixComponent,
        mixID: mix?.id ?? 0
    });

    useEffect(() => {
        setComponent({...defaultMixComponent, mixID: mix?.id ?? 0});
    }, [mix?.id])

    const submitHandler = (ev: FormEvent) => {
        if (!mix?.productId) {
            return;
        }
        ev.preventDefault();
        dispatch(saveMixComponent({productId: mix.productId, component: component}));
        setComponent({...defaultMixComponent, mixID: mix.id});
        itemCodeRef.current?.focus();
    }

    const updateNewComponent = (field: keyof ProductMixComponent) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
        case 'itemCode':
        case 'color_code':
            return setComponent({...component, [field]: ev.target.value});
        case 'itemQuantity':
            return setComponent({...component, itemQuantity: ev.target.valueAsNumber});
        }
    }

    const onChangeColor = (color: ProductColor) => {
        setComponent({...component, color, color_code: color.code, color_name: color.name, colorsId: color.id});
    }

    return (
        <>
            <hr/>
            <div className="row g-3">
                <div className="col-md-6 col-lg-5">
                    <h4>New Component</h4>
                    <form onSubmit={submitHandler} className="mt-3">
                        <FormColumn label="Item Code" width={colWidth}>
                            <div>
                                <input type="text" value={component.itemCode} className="form-control form-control-sm"
                                       required ref={itemCodeRef}
                                       list="pmc--item-code-colors"
                                       onChange={updateNewComponent('itemCode')}/>
                                <ItemDataList id="pmc--item-code-list" search={component.itemCode}/>
                            </div>
                            {!!components
                                .filter(comp => comp.itemCode === component.itemCode || comp.colorsId === component.colorsId)
                                .length && (
                                <Alert color="danger">That item already exists in this mix.</Alert>
                            )}
                        </FormColumn>
                        <FormColumn label="Color Code" width={colWidth}>
                            <ColorAutoComplete value={component.color_code ?? ''} onChangeColor={onChangeColor}/>
                        </FormColumn>
                        <FormColumn label="Quantity" width={colWidth}>
                            <input type="number" className="form-control form-control-sm"
                                   min={1}
                                   value={component.itemQuantity || ''} onChange={updateNewComponent('itemQuantity')}
                                   required/>
                        </FormColumn>
                        <FormColumn label="" width={colWidth}>
                            <SpinnerButton type="submit" className="btn btn-sm btn-primary me-1"
                                           spinning={status === 'saving'}
                                           disabled={!mix?.productId || status !== 'idle'}>
                                Add New Component
                            </SpinnerButton>
                        </FormColumn>
                    </form>
                </div>
                <div className="col-md-6 col-lg-7">
                    <h4>Components</h4>
                    <table className="table table-sm">
                        <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Color Code</th>
                            <th>Color Desc</th>
                            <th>Quantity</th>
                            <th className="text-center">Update</th>
                        </tr>
                        </thead>
                        <tbody>
                        {components.map(comp => (
                            <ProductMixComponentRow key={comp.id} productId={mix?.productId ?? 0} component={comp}/>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <th colSpan={2}>Total</th>
                            <th>{components.reduce((total, comp) => total + (comp?.itemQuantity || 0), 0)}</th>
                            <th></th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <hr/>
            <BOMDetail />
        </>
    )
}

export default ProductMixComponents;
