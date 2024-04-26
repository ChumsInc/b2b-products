import React, {useRef} from "react";
import {ProductVariant} from "b2b-types";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_SELF, SELL_AS_VARIANTS} from "../../../utils";
import {useSelector} from "react-redux";
import {selectCurrentVariant, selectCurrentVariantId} from "./selectors";
import {DropTargetMonitor, useDrag, useDrop} from "react-dnd";
import classNames from "classnames";
import ProductImage from "./ProductImage";
import {setCurrentVariant} from "./actions";
import {useAppDispatch} from "../../../app/hooks";
import type {Identifier, XYCoord} from 'dnd-core'

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
    const selectedVariantId = useSelector(selectCurrentVariantId);
    const ref = useRef<HTMLDivElement>(null);

    const [collectedProps, drop] = useDrop<DragItem, void, {handlerId: Identifier|null}>({
        accept: 'item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) {
                return;
            }
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
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
        'bg-primary-subtle': variant.product?.sellAs === SELL_AS_SELF,
        'bg-secondary-subtle': variant.product?.sellAs === SELL_AS_VARIANTS,
        'bg-success-subtle': variant.product?.sellAs === SELL_AS_MIX,
        'bg-danger-subtle': variant.product?.sellAs === SELL_AS_COLORS,
        'bg-danger': !variant.status || !variant.product?.status
    }

    const btnClassName = {
        'btn-primary': variant.isDefaultVariant && selectedVariantId === variant.id,
        'btn-outline-primary': variant.isDefaultVariant && selectedVariantId !== variant.id,
        'btn-secondary': !variant.isDefaultVariant && selectedVariantId === variant.id,
        'btn-outline-secondary': !variant.isDefaultVariant && selectedVariantId !== variant.id,
    }

    return (
        <div ref={ref} style={{...style, opacity}} className={classNames('sortable-item', itemClassName)}>
            <button type="button" onClick={onClick}
                    className={classNames("btn btn-sm mb-1 sortable-item--edit-button", btnClassName)}>
                Edit
            </button>
            <div className="sortable-item-padding">
                <div className={classNames({'text-primary': variant.isDefaultVariant})}>
                    {variant.title}
                    {(!variant.status || !variant.product?.status) && (
                        <span className="ms-1 bi-exclamation-triangle-fill text-warning" />
                    )}
                </div>
                <div><small>{variant.product?.itemCode}</small></div>
            </div>
        </div>
    )
}

export default SortableVariantItem;
