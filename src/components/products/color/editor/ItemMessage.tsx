import {Col, Form, FormControl, Row} from "react-bootstrap";
import TextArea from "@/components/common/TextArea.tsx";
import {type ChangeEvent, useId} from "react";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductColorItem} from "chums-types/b2b";

export default function ItemMessage() {
    const {value, updateValue} = useEditorContext<ProductColorItem>();
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({additionalData: {...value.additionalData, message: ev.target.value}});
    }

    return (
        <Form.Group as={Row}>
            <Form.Label column xs={4} htmlFor={id}>Item Message</Form.Label>
            <Col>
                <FormControl as={TextArea} size="sm" className="mb-2" id={id}
                             value={value.additionalData?.message ?? ''}
                             onChange={changeHandler}/>
            </Col>
        </Form.Group>
    )
}
