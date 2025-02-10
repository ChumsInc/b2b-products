import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {saveColor} from "../../ducks/colors/actions";
import {Editable, ProductColor} from "b2b-types";
import {selectColorsStatus, selectCurrentColor} from "../../ducks/colors/selectors";

import {defaultColor} from "../../defaults";
import {useAppDispatch} from "../app/hooks";
import Button from 'react-bootstrap/Button'
import {useNavigate} from "react-router";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import {FormControl, InputGroup} from "react-bootstrap";

export type EditableProductColor = ProductColor & Editable;

/**
 * @TODO: Load color from sku system colors to show any differences
 */

const ColorEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const current = useSelector(selectCurrentColor);
    const status = useSelector(selectColorsStatus);
    const navigate = useNavigate();
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
    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        await dispatch(saveColor(color));
        setColor({...defaultColor});
    }

    const newColorHandler = () => {
        navigate('/colors/new');
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <InputGroup size="sm" className="mb-1">
                    <InputGroup.Text className="input-group-text bi-key-fill"/>
                    <FormControl type="text"
                           value={color.code} onChange={onChangeField('code')}
                           className="form-control form-control-sm"/>
                    <InputGroup.Text className="input-group-text">
                        id: {color.id}
                    </InputGroup.Text>
                </InputGroup>
                <div className="input-group input-group-sm mb-1">
                    <span className="input-group-text bi-pen"/>
                    <input type="text"
                           value={color.name || ''} onChange={onChangeField('name')}
                           className="form-control form-control-sm"/>
                </div>
                <div className="row g-3 align-items-baseline">
                    <div className="col-auto">
                        <Button type="submit" size="sm" color="primary">
                            {status === 'saving' &&
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden/>}
                            Save
                        </Button>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                                onClick={() => setColor(current ?? defaultColor)}>Cancel
                        </button>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={newColorHandler}>
                            New
                        </button>
                    </div>
                    <div className="col">
                        {color.changed &&
                            <Alert color="warning"><span className="bi-exclamation-triangle-fill me-1"/>Color has been
                                changed.</Alert>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ColorEditor;
