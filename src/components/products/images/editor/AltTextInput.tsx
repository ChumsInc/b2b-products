import {Col, Form, Row} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductAlternateImage} from "chums-types/b2b";
import {type ChangeEvent, type RefObject, useId} from "react";

export interface AltTextInputProps {
    ref?: RefObject<HTMLInputElement|null>,
}
export default function AltTextInput({ref}:AltTextInputProps) {
    const {value, updateValue} = useEditorContext<ProductAlternateImage>();
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({altText: ev.target.value});
    }
    return (
        <Form.Group as={Row}>
            <Form.Label column={true} xs={4} htmlFor={id}>Alt Text</Form.Label>
            <Col>
                <Form.Control type="text" id={id} size="sm"
                              value={value.altText} onChange={changeHandler}
                              ref={ref}/>
                <Form.Text className="text-secondary">Use #SKU to show for only that SKU</Form.Text>
            </Col>
        </Form.Group>
    )
}
