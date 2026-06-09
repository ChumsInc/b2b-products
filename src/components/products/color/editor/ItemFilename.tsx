import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductColorItem} from "chums-types/b2b";
import {type ChangeEvent, useId} from "react";
import {Col, Form, FormControl, FormText, Row} from "react-bootstrap";

export default function ItemFilename() {
    const {value, updateValue} = useEditorContext<ProductColorItem>();
    const id = useId();
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({additionalData: {...value.additionalData, image_filename: ev.target.value}});
    }
    return (
        <Form.Group as={Row}>
            <Form.Label column xs={4}>Image</Form.Label>
            <Col>
                <FormControl type="text" size="sm" required id={id}
                             value={value.additionalData?.image_filename || ''}
                             onChange={changeHandler}/>
                <FormText className="text-muted">
                    {"Relative to path /images/products/{size}/"}
                </FormText>
            </Col>
        </Form.Group>
    )
}
