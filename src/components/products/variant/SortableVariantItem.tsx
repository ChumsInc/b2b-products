import React, {useRef} from "react";
import {ProductVariant} from "b2b-types";
import {useSelector} from "react-redux";
import {selectCurrentVariantId, setCurrentVariant} from "@/ducks/productVariants/productVariantsSlice";
import {DropTargetMonitor, useDrag, useDrop} from "react-dnd";
import classNames from "classnames";
import {useAppDispatch} from "../../app/hooks";
import type {Identifier} from 'dnd-core'
import styled from "@emotion/styled";
import ProductSellAsIcon from "@/components/products/list/ProductSellAsIcon";

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


const SortableItem = styled.div`
    width: 100%;
    flex: 0 0 auto;
    border-color: var(--bs-btn-border-color);
    border-radius: 3px;
    margin: 0.25rem;
    text-align: center;
    font-size: small;
    flex-direction: row;
    display: flex;
    cursor: move;
`

const SortableItemText = styled.div`
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex: 1 1 auto;
`
const SortableVariantItem: React.FC<SortableVariantItemProps> = ({variant, index, moveItem}) => {
    const dispatch = useAppDispatch();
    const selectedVariantId = useSelector(selectCurrentVariantId);
    const ref = useRef<HTMLDivElement>(null);

    const [_collectedProps, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
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
        'bg-secondary-subtle': variant.status && variant.product?.status,
        'bg-danger': !variant.status || !variant.product?.status
    }

    const btnClassName = {
        'btn-primary': variant.isDefaultVariant && selectedVariantId === variant.id,
        'btn-outline-primary': variant.isDefaultVariant && selectedVariantId !== variant.id,
        'btn-secondary': !variant.isDefaultVariant && selectedVariantId === variant.id,
        'btn-outline-secondary': !variant.isDefaultVariant && selectedVariantId !== variant.id,
    }

    return (
        <SortableItem ref={ref} style={{opacity}} className={classNames(itemClassName)}>
            <button type="button" onClick={onClick}
                    className={classNames("btn btn-sm mb-1 sortable-item--edit-button", btnClassName)}>
                Edit
            </button>
            <div className="sortable-item-padding">
                {variant.product && (<div>{<ProductSellAsIcon product={variant.product}/>}</div>)}
                <div className={classNames('text-start', {'text-primary': variant.isDefaultVariant,})}
                     style={{flex: '1 1 50%'}}>
                    {variant.title}
                    {(!variant.status || !variant.product?.status) && (
                        <span className="ms-1 bi-exclamation-triangle-fill text-warning"/>
                    )}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', flex: '1 1 50%'}}>
                    <div>{variant.product?.keyword}</div>
                    <div>{variant.product?.itemCode}</div>
                </div>
            </div>
        </SortableItem>
    )
}

export default SortableVariantItem;
