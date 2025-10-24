import React, {type HTMLAttributes, useEffect, useState} from 'react';
import type {ItemSearchFilter} from "@/types/item-search";
import {useLazyGetItemSearchQuery} from "@/src/api/items";


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
    const controller = new AbortController();
    // const dispatch = useAppDispatch();
    const [trigger, result] = useLazyGetItemSearchQuery({});
    // const items = useSelector(selectItemSearchList);


    const [timer, setTimer] = useState(0);

    useEffect(() => {
        return () => {
            controller.abort();
            window.clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        window.clearTimeout(timer);
        const newTimer = window.setTimeout(() => {
            trigger({search, ...filter})
            // dispatch(loadItemSearch({search, filter, signal: controller.signal}))
        }, delay);
        setTimer(() => newTimer);
    }, [search]);


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
