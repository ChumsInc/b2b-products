import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Alert, FormCheck, FormColumn, InputGroup, noop, SpinnerButton} from "chums-components";
import {selectCurrentMix, selectCurrentMixStatus} from "./selectors";
import {ProductMixItem} from "b2b-types/src/products";
import {loadMixBOM, saveMix} from "./actions";
import {defaultMixItem} from "../../../defaults";
import {selectCurrentProduct} from "../product/selectors";
import {useAppDispatch} from "../../../app/hooks";
import {Editable} from "b2b-types";


const colWidth = 8;
const ProductMixEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const product = useSelector(selectCurrentProduct);
    const current = useSelector(selectCurrentMix);
    const status = useSelector(selectCurrentMixStatus);

    const [mix, setMix] = useState<ProductMixItem & Editable>(current ?? {...defaultMixItem});

    useEffect(() => {
        setMix({...(current ?? defaultMixItem)});
    }, [current]);

    useEffect(() => {
        if (current) {
            dispatch(loadMixBOM(current.itemCode));
        }
    }, [current?.itemCode]);


    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveMix(mix));
    }

    const textChangeHandler = (field: keyof ProductMixItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
        case 'itemCode':
        case 'mixName':
            return setMix({...mix, [field]: ev.target.value, changed: true});
        }
    }

    const toggleChangeHandler = (field: keyof ProductMixItem) => () => {
        if (!current) {
            return;
        }
        switch (field) {
        case 'status':
            return setMix({...mix, [field]: !current[field], changed: true});
        }
    }

    return (
        <>
            <form onSubmit={submitHandler} className="mt-3">
                <FormColumn label="ID" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="number" readOnly value={mix.id} className="form-control form-control-sm"/>
                        <input type="text" readOnly value={mix.itemCode} className="form-control form-control-sm"/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Name" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={mix.mixName} onChange={textChangeHandler('mixName')} required/>
                </FormColumn>
                <FormColumn label="Status" width={colWidth} align="baseline">
                    <FormCheck label='Enabled' checked={mix.status} onChange={toggleChangeHandler('status')}
                               type="checkbox" inline/>
                    <FormCheck label='Inactive' checked={!!mix.inactiveItem} onChange={noop} disabled
                               type="checkbox" inline/>
                    <FormCheck label='Disco' checked={mix.productType === 'D'} onChange={noop} disabled
                               type="checkbox" inline/>
                    {mix.productType === null && (
                        <Alert color="danger">Item <strong>{mix.itemCode}</strong> does not exist.</Alert>
                    )}
                </FormColumn>

                <FormColumn label="" width={colWidth}>
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary me-1" spinning={status === 'saving'}
                                   disabled={!product?.id || status !== 'idle'}>
                        Save
                    </SpinnerButton>
                </FormColumn>
                <FormColumn label="" width={colWidth}>
                    {mix.changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
                </FormColumn>
            </form>
        </>
    )
}

export default ProductMixEditor;
