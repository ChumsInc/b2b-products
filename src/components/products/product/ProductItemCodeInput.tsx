import React, {ChangeEvent, useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "../../../ducks/products/product/selectors";
import {updateProduct} from "../../../ducks/products/product/actions";
import {useAppDispatch} from "../../app/hooks";
import {Button, FormControlProps, InputGroup} from "react-bootstrap";
import ItemFormControl from "@/components/common/ItemFormControl";
import {ItemSearchRecord} from "@/types/item-search";
import ErrorFallbackComponent from "@/components/app/ErrorFallbackComponent";
import {ErrorBoundary} from "react-error-boundary";

export interface ProductItemCodeInputProps {
    id?: string;
    inputProps?: FormControlProps;
}

export const ProductItemCodeInput = ({id, inputProps}: ProductItemCodeInputProps) => {
    const dispatch = useAppDispatch();
    const product = useSelector(selectCurrentProduct);
    const [itemCode, setItemCode] = useState(product?.itemCode ?? '');
    const [item, setItem] = useState<ItemSearchRecord | null>(null);

    useEffect(() => {
        setItemCode(product?.itemCode ?? '');
    }, [product?.itemCode])

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        return dispatch(updateProduct({itemCode: ev.target.value}));
    }

    const onCopyToName = () => {
        if (item) {
            dispatch(updateProduct({name: item.ItemCodeDesc}));
        }
    }

    const itemChangeHandler = (item: ItemSearchRecord) => {
        setItemCode(item.ItemCode);
        setItem(item);
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <InputGroup size="sm">
                <ItemFormControl id={id ?? inputProps?.id} size="sm"
                                 containerProps={{style: {flex: '1 1 auto'}}}
                                 value={itemCode} onChange={changeHandler}
                                 onChangeItem={itemChangeHandler}/>
                {item?.ItemCodeDesc && (
                    <InputGroup.Text>{item.ItemCodeDesc}</InputGroup.Text>
                )}
                <Button type="button" variant="secondary" size="sm"
                        onClick={onCopyToName} disabled={!item}>
                    <span className="bi-copy me-1" aria-label="Copy to Product Name"/>
                </Button>
            </InputGroup>
        </ErrorBoundary>
    )
}

export default ProductItemCodeInput;
