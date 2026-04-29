import React, {type HTMLAttributes, useEffect, useRef} from 'react';
import type {ItemSearchFilter} from "@/types/item-search";
import {useLazyGetItemSearchQuery} from "@/api/items";


export interface ItemDataListProps extends HTMLAttributes<HTMLDataListElement> {
    id: string,
    search: string,
    delay?: number,
    filter?: ItemSearchFilter,
}

const ItemDataList: React.FC<ItemDataListProps> = ({
                                                       id,
                                                       search,
                                                       delay = 600,
                                                       filter,
                                                       ...props
                                                   }) => {
    const [trigger, result] = useLazyGetItemSearchQuery({});
    const timerRef = useRef<number>(0);

    useEffect(() => {
        const controller = new AbortController();
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            trigger({search, ...filter})
        }, delay);

        return () => {
            controller.abort();
            window.clearTimeout(timerRef.current);
        }
    }, [delay, filter, search, trigger]);


    return (
        <datalist id={id} {...props}>
            {(result.data ?? [])
                .map(item => (
                    <option key={item.ItemCode} value={item.ItemCode} className={`item-data-list--${item.ProductType}`}>
                        {item.ItemCodeDesc}
                    </option>
                ))}
        </datalist>
    )
}

export default ItemDataList;
