import React, {ChangeEvent, FormEvent} from 'react';
import {useSelector} from "react-redux";
import {Alert, FormCheck, FormColumn, InputGroup, noop, SpinnerButton} from "chums-components";
import {selectCurrentMix, selectCurrentMixLoading, selectCurrentMixSaving, selectCurrentProduct} from "../selectors";
import {ProductMixItem} from "b2b-types/src/products";
import {saveCurrentMixAction, updateCurrentMixAction} from "../actions";
import {useAppDispatch} from "../../../app/hooks";


const colWidth = 8;
const ProductColorEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const product = useSelector(selectCurrentProduct);
    const current = useSelector(selectCurrentMix);
    const loading = useSelector(selectCurrentMixLoading);
    const saving = useSelector(selectCurrentMixSaving);


    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveCurrentMixAction());
    }

    const textChangeHandler = (field: keyof ProductMixItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
        case 'itemCode':
        case 'mixName':
            return dispatch(updateCurrentMixAction({[field]: ev.target.value}));
        }
    }

    const toggleChangeHandler = (field: keyof ProductMixItem) => () => {
        switch (field) {
        case 'status':
            return dispatch(updateCurrentMixAction({[field]: !current[field]}));
        }
    }

    return (
        <>
            <form onSubmit={submitHandler} className="mt-3">
                <FormColumn label="ID" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="number" readOnly value={current.id} className="form-control form-control-sm"/>
                        <input type="text" readOnly value={current.itemCode} className="form-control form-control-sm"/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Namer" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={current.mixName} onChange={textChangeHandler('mixName')} required/>
                </FormColumn>
                <FormColumn label="Status" width={colWidth} align="baseline">
                    <FormCheck label='Enabled' checked={current.status} onChange={toggleChangeHandler('status')}
                               type="checkbox" inline/>
                    <FormCheck label='Inactive' checked={!!current.inactiveItem} onChange={noop} disabled
                               type="checkbox" inline/>
                    <FormCheck label='Disco' checked={current.productType === 'D'} onChange={noop} disabled
                               type="checkbox" inline/>
                    {current.productType === null &&
                        <Alert color="danger">Item <strong>{current.itemCode}</strong> does not exist.</Alert>}
                </FormColumn>

                <FormColumn label="" width={colWidth}>
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary me-1" spinning={saving}
                                   disabled={!product.id || loading || saving}>
                        Save
                    </SpinnerButton>
                </FormColumn>
                <FormColumn label="" width={colWidth}>
                    {current.changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
                </FormColumn>
            </form>
        </>
    )
}

export default ProductColorEditor;
