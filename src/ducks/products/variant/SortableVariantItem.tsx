import React, {useRef} from "react";
import {ProductVariant} from "b2b-types";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_SELF, SELL_AS_VARIANTS} from "../../../utils";
import {useSelector} from "react-redux";
import {selectCurrentVariant} from "./selectors";
import {DropTargetMonitor, useDrag, useDrop} from "react-dnd";
import classNames from "classnames";
import ProductImage from "./ProductImage";
import {setCurrentVariant} from "./actions";
import {useAppDispatch} from "../../../app/hooks";

interface SortableVariantItemProps {
    variant: ProductVariant,
    index: number,
    moveItem: (dragIndex: number, hoverIndex: number) => void,
    children?: React.ReactNode,
}

interface DragItem {
    index: number,
    id: string,
    type: string,
}

const style = {
    cursor: 'move',
}

const SortableVariantItem: React.FC<SortableVariantItemProps> = ({variant, index, moveItem}) => {
    const dispatch = useAppDispatch();
    const selectedVariant = useSelector(selectCurrentVariant);
    const ref = useRef<HTMLDivElement>(null);

    const [collectedProps, drop] = useDrop({
        accept: 'item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: unknown, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = (item as DragItem).index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) {
                return;
            }
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            const hoverClientX = clientOffset.x - hoverBoundingRect.left;

            if (dragIndex < hoverIndex && (hoverClientX < hoverMiddleX || hoverClientY < hoverMiddleY)) {
                return;
            }

            moveItem(dragIndex, hoverIndex);
            (item as DragItem).index = hoverIndex;
        },
    });

    const [{isDragging}, drag] = useDrag({
        type: 'item',
        item: () => {
            return {variant, index};
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging()
        })
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    const onClick = () => {
        dispatch(setCurrentVariant(variant));
    };

    const itemClassName = {
        dragging: isDragging,
        'sell-as-self': variant.product?.sellAs === SELL_AS_SELF,
        'sell-as-variants': variant.product?.sellAs === SELL_AS_VARIANTS,
        'sell-as-mix': variant.product?.sellAs === SELL_AS_MIX,
        'sell-as-colors': variant.product?.sellAs === SELL_AS_COLORS,
        'text-danger': !variant.status || !variant.product?.status
    }

    const btnClassName = {
        'btn-primary': selectedVariant?.id !== variant.id && variant.isDefaultVariant,
        'btn-outline-primary': selectedVariant?.id === variant.id && variant.isDefaultVariant,
        'btn-light': selectedVariant?.id === variant.id && !variant.isDefaultVariant,
        'btn-dark': selectedVariant?.id !== variant.id && !variant.isDefaultVariant,
    }

    return (
        <div ref={ref} style={{...style, opacity}} className={classNames('sortable-item', itemClassName)}>
            <button type="button" onClick={onClick}
                    className={classNames("btn btn-sm mb-1 sortable-item--edit-button", btnClassName)}>
                Edit
            </button>
            <div className="sortable-item-padding">
                <ProductImage imageUrl={variant.product?.image} defaultColor={variant.product?.defaultColor} size="80"/>
                <div className={classNames({'text-primary': variant.isDefaultVariant})}>{variant.title}</div>
                <div><small>{variant.product?.itemCode}</small></div>
            </div>
        </div>
    )
}

export default SortableVariantItem;
