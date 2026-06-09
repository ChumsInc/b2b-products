import {Col, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import {type ChangeEvent, type RefObject, useId} from "react";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductColorItem} from "chums-types/b2b";

export interface ColorItemCodeInputProps {
    ref: RefObject<HTMLInputElement|null>;
}
export default function ItemCodeInput({ref}:ColorItemCodeInputProps) {
    const {value, updateValue} = useEditorContext<ProductColorItem>();
    const id = useId();
    const itemId = useId()

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({itemCode: ev.target.value});
    }

    return (
        <Form.Group as={Row}>
            <Form.Label column xs={4} htmlFor={itemId}>Item Code</Form.Label>
            <Col>
                <InputGroup size="sm">
                    <FormControl type="text" size="sm" ref={ref} id={itemId}
                                 value={value.itemCode} onChange={changeHandler} required/>
                    <InputGroup.Text as="label" htmlFor={id}>ID</InputGroup.Text>
                    <FormControl id={id} size="sm" readOnly value={value.id} style={{maxWidth: '5rem'}}/>
                </InputGroup>
            </Col>
        </Form.Group>
    )
}
