import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {SpinnerButton} from "chums-components";
import {saveColor, setCurrentColor} from "./actions";
import {Editable, ProductColor} from "b2b-types";
import {selectColorsStatus, selectCurrentColor} from "./selectors";

import {defaultColor} from "../../defaults";
import {useAppDispatch} from "../../app/hooks";

export type EditableProductColor = ProductColor & Editable;

const ColorEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const current = useSelector(selectCurrentColor);
    const status = useSelector(selectColorsStatus);

    const [color, setColor] = useState<EditableProductColor>(current ?? defaultColor);

    useEffect(() => {
        setColor(current ?? defaultColor);
    }, [current]);

    const onChangeField = (field: keyof ProductColor) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
        case 'code':
        case 'name':
            setColor({...color, [field]: ev.target.value, changed: true});
        }
    }
    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveColor(color));
    }

    const newColorHandler = () => {
        dispatch(setCurrentColor());
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="input-group input-group-sm mb-1">
                <span className="input-group-text bi-key-fill"/>
                <input type="text"
                       value={color.code} onChange={onChangeField('code')}
                       className="form-control form-control-sm"/>
            </div>
            <div className="input-group input-group-sm mb-1">
                <span className="input-group-text bi-pen"/>
                <input type="text"
                       value={color.name || ''} onChange={onChangeField('name')}
                       className="form-control form-control-sm"/>
            </div>
            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <SpinnerButton type="submit" size="sm" color="primary"
                                   spinning={status === 'saving'}>Save</SpinnerButton>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary">Cancel</button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={newColorHandler}>
                        New
                    </button>
                </div>
                <div className="col-auto">
                    <pre><code>id = {color.id}</code></pre>
                </div>
            </div>
        </form>
    )
}

export default ColorEditor;
