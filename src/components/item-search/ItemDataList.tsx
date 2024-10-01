import React, {HTMLAttributes, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {ItemSearchFilter} from "../../types/item-search";
import {useAppDispatch} from "../app/hooks";
import {selectItemSearchList} from "../../ducks/item-search/selectors";
import {loadItemSearch} from "../../ducks/item-search/actions";


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
    const dispatch = useAppDispatch();
    const items = useSelector(selectItemSearchList);

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
            dispatch(loadItemSearch({search, filter, signal: controller.signal}))
        }, delay);
        setTimer(() => newTimer);
    }, [search]);


    return (
        <datalist id={id} {...props}>
            {Object.keys(items)
                .map(key => items[key])
                .map(item => (
                    <option key={item.ItemCode} value={item.ItemCode} className={`item-data-list--${item.ProductType}`}>
                        {item.ItemCodeDesc}
                    </option>
                ))}
        </datalist>
    )
}

export default ItemDataList;
