import React, {ChangeEvent, FormEvent} from "react";
import {useSelector} from "react-redux";
import {SpinnerButton} from "chums-components";
import {saveColorAction, setCurrentColorAction, updateCurrentColorAction} from "./actions";
import {ProductColor} from "b2b-types";
import {selectColorSaving, selectCurrentColor} from "./selectors";
import {useAppDispatch} from "../../app/hooks";

const ColorEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const current = useSelector(selectCurrentColor);
    const saving = useSelector(selectColorSaving);
    const onChangeField = (field: keyof ProductColor) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
        case 'code':
        case 'name':
            dispatch(updateCurrentColorAction({[field]: ev.target.value}));
        }
    }
    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveColorAction());
    }

    const newImageHandler = () => {
        dispatch(setCurrentColorAction());
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="input-group input-group-sm mb-1">
                <span className="input-group-text bi-key-fill"/>
                <input type="text"
                       value={current.code} onChange={onChangeField('code')}
                       className="form-control form-control-sm"/>
            </div>
            <div className="input-group input-group-sm mb-1">
                <span className="input-group-text bi-pen"/>
                <input type="text"
                       value={current.name || ''} onChange={onChangeField('name')}
                       className="form-control form-control-sm"/>
            </div>
            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <SpinnerButton type="submit" size="sm" color="primary" spinning={saving}>Save</SpinnerButton>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary">Cancel</button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={newImageHandler}>New
                    </button>
                </div>
                <div className="col-auto">
                    <pre><code>id = {current.id}</code></pre>
                </div>
            </div>
        </form>
    )
}

export default ColorEditor;
