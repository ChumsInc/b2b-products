import React, {useCallback, useEffect, useState} from 'react';
import {SortProps} from "@chumsinc/sortable-tables";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useSelector} from "react-redux";
import {selectCurrentProductVariants, selectCurrentVariantSort} from "@/ducks/productVariants/productVariantsSlice";
import {variantListSorter} from "@/ducks/products/sorter";
import SortableVariantItem from "./SortableVariantItem";
import {saveVariantsSort} from "@/ducks/productVariants/actions";
import {useAppDispatch} from "../../app/hooks";
import {ProductVariant} from "b2b-types";
import update from 'immutability-helper';
import {VariantSortArgs} from "@/types/variant";
import {variantSortKey} from "@/ducks/productVariants/utils";
import SpinnerButton from "@/components/common/SpinnerButton";


export const variantPrioritySort: SortProps<ProductVariant> = {
    field: 'priority',
    ascending: true,
}

const SortableVariantList = () => {
    const dispatch = useAppDispatch();
    const variants = useSelector(selectCurrentProductVariants);
    const currentSort = useSelector(selectCurrentVariantSort);
    const saving = false;

    const [items, setItems] = useState([...variants].sort(variantListSorter(variantPrioritySort)));
    const [sorted, setSorted] = useState(currentSort);

    useEffect(() => {
        setItems([...variants].sort(variantListSorter(variantPrioritySort)));
    }, [variants]);

    useEffect(() => {
        setSorted(variantSortKey(items));
    }, [items]);


    const onMoveItem = useCallback((dragIndex: number, hoverIndex: number) => {
        setItems((prevItems: ProductVariant[]) =>
            update(prevItems, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevItems[dragIndex] as ProductVariant]
                ]
            })
        )
    }, [variants]);

    // const renderVariant = useCallback((variant: ProductVariant, index: number) => {
    //     return (
    //         <SortableVariantItem key={variant.id} variant={variant} index={index} moveItem={onMoveItem}/>
    //     )
    // }, [variants])

    const saveClickHandler = async () => {
        const sorted:VariantSortArgs[] = items.map((item, index) => ({parentProductID: item.parentProductID, id: item.id, priority: index}))
        await dispatch(saveVariantsSort(sorted));
    }

    console.log('sorted', items.map(item => item.id))
    return (
        <div>
            <div className="row g-3 my-1 align-items-baseline">
                <div className="col-auto">
                    <SpinnerButton type="button" variant={currentSort === sorted ? "outline-secondary" : 'warning'}
                                   spinning={saving} size="sm"
                                   onClick={saveClickHandler}>
                        Save Current Sort
                    </SpinnerButton>
                </div>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div className="sortable-variant-list">
                    {items.map((variant, index) => (
                        <SortableVariantItem key={variant.id} variant={variant} index={index} moveItem={onMoveItem}/>
                    ))}
                </div>
            </DndProvider>
        </div>
    )
}

export default SortableVariantList;
