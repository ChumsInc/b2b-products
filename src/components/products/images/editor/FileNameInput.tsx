import {Col, Form, Row} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductAlternateImage} from "chums-types/b2b";
import {type ChangeEvent, type RefObject, useId} from "react";

export interface FileNameInputProps {
    ref?: RefObject<HTMLInputElement|null>,
}
export default function FileNameInput({ref}:FileNameInputProps) {
    const {value, updateValue} = useEditorContext<ProductAlternateImage>();
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({image: ev.target.value});
    }
    return (
        <Form.Group as={Row}>
            <Form.Label column={true} xs={4} htmlFor={id}>File Name</Form.Label>
            <Col>
                <Form.Control type="text" id={id} size="sm"
                              value={value.image} onChange={changeHandler}
                              ref={ref}/>
            </Col>
        </Form.Group>
    )
}
