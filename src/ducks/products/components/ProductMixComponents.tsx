import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import {
    selectCurrentMix,
    selectCurrentMixComponents,
    selectCurrentMixLoading,
    selectCurrentMixSaving
} from "../selectors";
import {ProductMixComponent} from "b2b-types/src/products";
import {saveMixComponentAction, updateCurrentMixComponentAction} from "../actions";
import {saveMixComponent} from "../actionTypes";
import {defaultMixComponent} from "../../../defaults";
import ColorDataList from "../../colors/ColorDataList";
import ItemDataList from "../../item-search/ItemDataList";
import {AlertList} from "chums-connected-components";
import {useAppDispatch} from "../../../app/hooks";


const colWidth = 8;
const ProductMixComponents: React.FC = () => {
    const dispatch = useAppDispatch();
    const mix = useSelector(selectCurrentMix);
    const components = useSelector(selectCurrentMixComponents);
    const saving = useSelector(selectCurrentMixSaving);
    const loading = useSelector(selectCurrentMixLoading);

    const [newComponent, setNewComponent] = useState<ProductMixComponent>({...defaultMixComponent, mixID: mix.id});

    useEffect(() => {
        setNewComponent({...defaultMixComponent, mixID: mix.id});
    }, [mix.id])

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveMixComponentAction(newComponent));
        setNewComponent({...defaultMixComponent, mixID: mix.id});
    }

    const updateNewComponent = (field: keyof ProductMixComponent) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
        case 'itemCode':
        case 'color_code':
            return setNewComponent({...newComponent, [field]: ev.target.value});
        case 'itemQuantity':
            return setNewComponent({...newComponent, itemQuantity: ev.target.valueAsNumber});
        }
    }

    const updateExistingComponentQuantity = (component: ProductMixComponent) => (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCurrentMixComponentAction({...component, itemQuantity: ev.target.valueAsNumber}));
    }

    const saveExistingComponentHandler = (component: ProductMixComponent) => () => {
        dispatch(saveMixComponentAction(component));
    }

    return (
        <>
            <hr/>
            <h4>New Component</h4>
            <form onSubmit={submitHandler} className="mt-3">
                <FormColumn label="Item Code" width={colWidth}>
                    <div>
                        <input type="text" value={newComponent.itemCode} className="form-control form-control-sm"
                               required
                               list="pmc--item-code-list"
                               onChange={updateNewComponent('itemCode')}/>
                        <ItemDataList id="pmc--item-code-list" search={newComponent.itemCode}/>
                    </div>
                    {!!components.filter(comp => comp.itemCode === newComponent.itemCode).length && (
                        <Alert color="danger">That item already exists in this mix.</Alert>
                    )}
                </FormColumn>
                <FormColumn label="Color Code" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           list="pmc--color-code-list"
                           value={newComponent.color_code} onChange={updateNewComponent('color_code')} required/>
                    <ColorDataList id="pmc--color-code-list"/>
                </FormColumn>
                <FormColumn label="Quantity" width={colWidth}>
                    <input type="number" className="form-control form-control-sm"
                           min={1}
                           value={newComponent.itemQuantity || ''} onChange={updateNewComponent('itemQuantity')}
                           required/>
                </FormColumn>
                <FormColumn label="" width={colWidth}>
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary me-1" spinning={saving}
                                   disabled={!mix.productId || loading || saving}>
                        Add New Component
                    </SpinnerButton>
                </FormColumn>
                <AlertList context={saveMixComponent}/>
            </form>
            <hr/>
            <h4>Components</h4>
            <table className="table table-sm">
                <thead>
                <tr>
                    <th>Item Code</th>
                    <th>Color Code</th>
                    <th>Quantity</th>
                    <th className="text-center">Update</th>
                </tr>
                </thead>
                <tbody>
                {components.map(comp => (
                    <tr key={comp.id}>
                        <td>{comp.itemCode}</td>
                        <td>{comp.color?.code}</td>
                        <td>
                            <input type="number" className="form-control form-control-sm" min={0}
                                   value={comp.itemQuantity}
                                   onChange={updateExistingComponentQuantity(comp)}/>
                        </td>
                        <td>
                            <button type="button" className="btn btn-sm btn-outline-primary" disabled={!comp.changed}
                                    onClick={saveExistingComponentHandler(comp)}>
                                Save
                            </button>
                        </td>
                    </tr>
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
        </>
    )
}

export default ProductMixComponents;
