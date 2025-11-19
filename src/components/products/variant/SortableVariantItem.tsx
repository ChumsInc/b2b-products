import type {ProductVariant} from "b2b-types";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import ThumbedVariantItem from "@/components/products/variant/ThumbedVariantItem.tsx";

export interface SortableVariantItemProps {
    variant: ProductVariant,
    active?: boolean,
}


export default function SortableVariantItem({variant, active}: SortableVariantItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        setActivatorNodeRef
    } = useSortable({id: variant.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <ThumbedVariantItem variant={variant} active={active}
                                setActivatorNodeRef={setActivatorNodeRef}
                                listeners={listeners}/>
        </div>
    )
}
