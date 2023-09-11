import React, {useEffect, useState} from 'react';
import {SortProps, SpinnerButton} from "chums-components";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useSelector} from "react-redux";
import {selectCurrentProductVariants} from "./selectors";
import {variantListSorter} from "../sorter";
import SortableVariantItem from "./SortableVariantItem";
import {saveVariantsSort} from "./actions";
import {useAppDispatch} from "../../../app/hooks";
import {ProductVariant} from "b2b-types";


export const variantPrioritySort: SortProps<ProductVariant> = {
    field: 'priority',
    ascending: true,
}

const SortableVariantList = () => {
    const dispatch = useAppDispatch();
    const variants = useSelector(selectCurrentProductVariants);
    const saving = false;

    const [items, setItems] = useState([...variants].sort(variantListSorter(variantPrioritySort)));

    useEffect(() => {
        setItems([...variants].sort(variantListSorter(variantPrioritySort)));
    }, [variants]);


    const onMoveItem = (dragIndex: number, hoverIndex: number) => {
        const sorted = [...items];
        const movingItem = sorted[dragIndex];
        sorted.splice(dragIndex, 1);
        sorted.splice(hoverIndex, 0, movingItem);
        setItems(sorted.map((item, index) => ({...item, priority: index})));
    }

    const saveClickHandler = () => {
        dispatch(saveVariantsSort(items));
    }

    return (
        <div>
            <div className="row g-3 my-1 align-items-baseline">
                <div className="col-auto">
                    <SpinnerButton type="button" color="outline-secondary" spinning={saving} size="sm"
                                   onClick={saveClickHandler}>
                        Save Current Sort
                    </SpinnerButton>
                </div>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div className="sortable-variant-list">
                    {[...items]
                        .map((v, index) => (
                            <SortableVariantItem key={v.id} variant={v} index={index} moveItem={onMoveItem}/>
                        ))
                    }
                </div>
            </DndProvider>
        </div>
    )
}

export default SortableVariantList;
