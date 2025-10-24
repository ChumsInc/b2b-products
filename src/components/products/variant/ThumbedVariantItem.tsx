import type {SortableVariantItemProps} from "@/components/products/variant/SortableVariantItem.tsx";
import type {SyntheticListenerMap} from "@dnd-kit/core/dist/hooks/utilities";
import styled from "@emotion/styled";
import {Button} from "react-bootstrap";
import classNames from "classnames";
import VariantItem from "@/components/products/variant/VariantItem.tsx";

const SortableVariantContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 1rem;
    padding: 0 0;
    margin: 0.25rem 0;
    border: 1px solid var(--bs-border-color);
    border-radius: 0.25rem;
    background-color: var(--bs-body-bg);
    &.active {
        border-color: var(--bs-primary);
    }
    &:hover {
        //border-color: var(--bs-primary);
    }
    &:focus-within {}
    & > .btn.drag-thumb {
        border-left: none;
        border-top: none;
        border-bottom: none;
        border-radius: 0;
        border-right: 1px solid var(--bs-border-color);
        cursor: grab;
    }
`

export interface ThumbedVariantItemProps extends SortableVariantItemProps {
    setActivatorNodeRef?: (element: HTMLElement|null) => void;
    listeners?: SyntheticListenerMap|undefined;
}
export default function ThumbedVariantItem({variant, active, setActivatorNodeRef, listeners}:ThumbedVariantItemProps) {
    return (
        <SortableVariantContainer className={classNames('sortable-variant', {active: active ? 'active' : ''})}>
            <Button size="sm" type="button"
                    variant="outline-secondary" className="drag-thumb" {...listeners} ref={setActivatorNodeRef} >
                <span className="bi-arrow-down-up" aria-label="Drag to sort" />
            </Button>
            <VariantItem variant={variant} active={active} />
        </SortableVariantContainer>
    )
}
