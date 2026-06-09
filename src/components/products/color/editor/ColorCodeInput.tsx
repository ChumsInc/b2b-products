import {type ChangeEvent, useId} from "react";
import {Col, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import ColorAutoComplete from "@/components/colors/ColorAutoComplete.tsx";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductColor, ProductColorItem} from "chums-types/b2b";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProduct} from "@/ducks/products/productSlice.ts";

export default function ColorCodeInput() {
    const currentProduct = useAppSelector(selectCurrentProduct);
    const {value, updateValue} = useEditorContext<ProductColorItem>();
    const idColorCode = useId();
    const idSwatch = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({colorCode: ev.target.value});
    }

    const onChangeColor = (color: ProductColor | null) => {
        if (color) {
            updateValue({colorCode: color.code, color});
        }
    }

    const swatchChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({additionalData: {...value.additionalData, swatch_code: ev.target.value}});
    }

    return (
        <Form.Group as={Row}>
            <Form.Label column xs={4} htmlFor={idColorCode}>
                Color Code
            </Form.Label>
            <Col>
                <ColorAutoComplete id={idColorCode} value={value.colorCode}
                                   inputProps={{onChange: changeHandler}}
                                   swatchFormat={value.additionalData?.swatch_code ?? currentProduct?.additionalData?.swatch_format}
                                   onChangeColor={onChangeColor}/>
            </Col>
            <Col xs={3}>
                <InputGroup size="sm"  title="CSS selector for swatch color if different than color code.">
                    <InputGroup.Text as="label" htmlFor={idSwatch}>Swatch</InputGroup.Text>
                    <FormControl type="text" size="sm" id={idSwatch}
                                 placeholder={currentProduct?.additionalData?.swatch_code ?? value.colorCode}
                                 value={value.additionalData?.swatch_code || ''}
                                 onChange={swatchChangeHandler}/>
                </InputGroup>
            </Col>
        </Form.Group>
    )
}
