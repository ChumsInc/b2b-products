import React, {TableHTMLAttributes, useEffect} from 'react';
import {BOMComponent} from "@/types/item-search";
import {useAppSelector} from "@/components/app/hooks";
import {selectCurrentMixComponents} from "@/ducks/products/mix/selectors";
import {ProductMixComponent} from "b2b-types/src/products";
import classNames from "classnames";

export interface BomDetailRowProps extends TableHTMLAttributes<HTMLTableRowElement> {
    item:BOMComponent
}
export default function BomDetailRow({item, ...rest}: BomDetailRowProps) {
    const components = useAppSelector(selectCurrentMixComponents);
    const [component, setComponent] = React.useState<ProductMixComponent|null>(null);
    useEffect(() => {
        const [component] = components.filter(c => c.itemCode === item.ComponentItemCode)
        setComponent(component ?? null);
    }, [item, components]);

    const rowClassName = classNames({
        'table-danger': !component,
        'table-warning': component?.itemQuantity !== +item.QuantityPerBill,
        'table-success': component?.itemQuantity === +item.QuantityPerBill,
    });
    return (
        <tr className={rowClassName} {...rest} style={{cursor: rest.onClick ? "pointer" : undefined }}>
            <td>{item.ComponentItemCode}</td>
            <td>{item.ComponentDesc}</td>
            <td className="text-end">{item.QuantityPerBill}</td>
        </tr>
    )
}
