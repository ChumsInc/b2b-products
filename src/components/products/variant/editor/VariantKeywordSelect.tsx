import {useId, useState} from "react";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {Keyword, ProductVariant} from "b2b-types";
import VariantRow from "@/components/products/variant/editor/VariantRow.tsx";
import {Alert, Collapse, InputGroup} from "react-bootstrap";
import KeywordSelectInputGroup from "@/components/keywords/KeywordSelectInputGroup.tsx";
import {Link} from "react-router";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProductKeyword} from "@/ducks/products/productSlice.ts";

export interface VariantKeywordSelectProps {
    onAlert: (alert: string|null) => void;
}
export default function VariantKeywordSelect({onAlert}:VariantKeywordSelectProps) {
    const productKeyword = useAppSelector(selectCurrentProductKeyword);
    const id = useId();
    const {value, updateValue} = useEditorContext<ProductVariant>()
    const [alert, setAlert] = useState<string | null>(null);

    const keywordChangeHandler = (kw: Keyword | null) => {
        const alert = kw?.id === value.variantProductID ? 'A productVariants cannot be its own parent' : null;
        setAlert(alert);
        onAlert(alert);
        if (!alert) {
            updateValue({variantProductID: kw?.id ?? 0, status: Boolean(kw?.status ?? false)});
        }
        // const [exists] = currentVariants.filter(v => v.id !== variant.id && v.variantProductID === kw?.id);
        // if (exists && !alert) {
        //     alert = `This variant product already exists in the current product`;
        // }
        // setAlert(alert);
        // setVariant({...variant, status: Boolean(kw?.status ?? false), variantProductID: kw?.id ?? 0});
    }

    return (
        <VariantRow label="Child" labelProps={{htmlFor: id}}>
            <KeywordSelectInputGroup pageType="product" id={id}
                                     value={value.variantProductID}
                                     required disabledKeywords={[productKeyword]}
                                     onSelectKeyword={keywordChangeHandler}>
                {value.product && (
                    <InputGroup.Text as={Link} to={`/products/${value.product?.keyword}`}>
                        <span className="bi-link" aria-label="Edit Variant"/>
                    </InputGroup.Text>
                )}
            </KeywordSelectInputGroup>
            <Collapse in={typeof alert === 'string' && alert.length > 0}>
                <div>
                    <Alert variant="danger">{JSON.stringify(alert)}</Alert>
                </div>
            </Collapse>
        </VariantRow>
    )

}
