import {useEffect, useState} from 'react';
import {
    selectCurrentVariantId,
    selectCurrentVariantSort,
    selectSortedVariants
} from "@/ducks/products/productVariantsSlice";
import SortableVariantItem from "./SortableVariantItem";
import {saveVariantsSort} from "@/ducks/products/actions/variants-actions.ts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import type {ProductVariant} from "b2b-types";
import type {VariantSortArgs} from "@/types/variant";
import {variantSortKey} from "@/ducks/products/utils/variants-utils.ts";
import SpinnerButton from "@/components/common/SpinnerButton";
import {closestCenter, DndContext, type DragEndEvent, DragOverlay, type DragStartEvent} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import ThumbedVariantItem from "@/components/products/variant/ThumbedVariantItem.tsx";

const SortableVariantList = () => {
    const dispatch = useAppDispatch();
    const variants = useAppSelector(selectSortedVariants);
    const currentVariantId = useAppSelector(selectCurrentVariantId);
    const currentSort = useAppSelector(selectCurrentVariantSort);
    const saving = false;

    const [items, setItems] = useState<ProductVariant[]>(variants);
    const [draggingItem, setDraggingItem] = useState<ProductVariant | null>(null);
    const [sorted, setSorted] = useState(currentSort);

    useEffect(() => {
        setItems(variants);
    }, [variants]);

    useEffect(() => {
        setSorted(variantSortKey(items));
    }, [items]);

    const saveClickHandler = async () => {
        const sorted: VariantSortArgs[] = items.map((item, index) => ({
            parentProductID: item.parentProductID,
            id: item.id,
            priority: index
        }))
        await dispatch(saveVariantsSort(sorted));
    }

    const handleDragStart = (event: DragStartEvent) => {
        const item = variants.find((variant) => variant.id === event.active.id);
        setDraggingItem(item ?? null);
    }
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over) {
            return;
        }
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((el) => el.id === active.id);
                const newIndex = items.findIndex((el) => el.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            })
        }
        setDraggingItem(null);
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
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter} >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {items.map((variant) => (
                        <SortableVariantItem variant={variant} key={variant.id}
                                             active={variant.id === currentVariantId}/>
                    ))}
                </SortableContext>
                <DragOverlay>
                    {draggingItem && (
                        <ThumbedVariantItem variant={draggingItem} active={draggingItem.id === currentVariantId}/>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default SortableVariantList;
