import React, {type HTMLAttributes, type KeyboardEvent, useEffect, useRef, useState} from 'react';
import {FormControl, type FormControlProps, ListGroup} from "react-bootstrap";
import {useLazyGetItemSearchQuery} from "@/src/api/items";
import {useFloating} from '@floating-ui/react-dom'
import type {ItemSearchFilter, ItemSearchRecord} from "@/types/item-search";
import useClickOutside from "@/src/hooks/click-outside";

export interface ItemFormControlProps extends Omit<FormControlProps, 'ref'> {
    value: string;
    onChangeItem: (item: ItemSearchRecord) => void;
    ref?: React.RefObject<HTMLInputElement | null>;
    containerProps?: HTMLAttributes<HTMLDivElement>;
    lookupDelay?: number;
    invalidItems?: string[];
    filter?: ItemSearchFilter;
}

export default function ItemFormControl({
                                            value,
                                            onChangeItem,
                                            lookupDelay,
                                            filter,
                                            ref,
                                            containerProps,
                                            invalidItems,
                                            ...rest
                                        }: ItemFormControlProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [reference, setReference] = useState<HTMLInputElement | null>(inputRef.current);
    const [trigger, result] = useLazyGetItemSearchQuery({});
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(-1);
    const {refs, floatingStyles} = useFloating({placement: 'bottom-start', elements: {reference}});
    const timerRef = useRef<number>(0);
    const [items, setItems] = useState<ItemSearchRecord[]>([]);

    useClickOutside(containerRef, () => setOpen(false));

    useEffect(() => {
        setReference(ref?.current ?? inputRef.current)
    }, [inputRef, ref]);

    useEffect(() => {
        if (!value) {
            return;
        }
        timerRef.current = window.setTimeout(() => {
            trigger({search: value ?? '', ...filter});
        }, lookupDelay ?? 350)
        return () => {
            window.clearTimeout(timerRef.current);
        }
    }, [value, filter]);

    useEffect(() => {
        const isFocused = open || document.activeElement === refs.reference.current;
        setItems(result.data ?? []);
        setOpen((result.data ?? []).length > 0 && isFocused);
    }, [result]);

    const inputHandler = (ev: KeyboardEvent<HTMLInputElement>) => {
        const len = Math.min(items.length, 25);
        let current: ItemSearchRecord | null = null;
        switch (ev.key) {
            case 'Escape':
                setOpen(false);
                ev.preventDefault();
                ev.stopPropagation();
                return;
            case 'ArrowDown':
                ev.preventDefault();
                setOpen(true);
                setIndex((index + 1) % len);
                return;
            case 'ArrowUp':
                ev.preventDefault();
                setOpen(true);
                setIndex((index - 1 + len) % len);
                return;
            case 'Enter':
                ev.stopPropagation();
                ev.preventDefault();
                current = items[index];
                if (!open) {
                    return;
                }
                setOpen(false)
                if (onChangeItem) {
                    onChangeItem(current);
                }
        }

    }

    return (
        <div ref={containerRef} {...containerProps}>
            <FormControl ref={refs.setReference} value={value} {...rest} onKeyDown={inputHandler} autoComplete="off"/>
            <div style={{height: '20rem', zIndex: 10, ...floatingStyles}} ref={refs.setFloating}>
                {open && (
                    <ListGroup>
                        {items
                            .slice(0, 25)
                            .map((item, i) => (
                                <ListGroup.Item key={item.ItemCode} active={index === i}
                                                onClick={() => onChangeItem(item)}
                                                disabled={invalidItems?.includes(item.ItemCode)}
                                                style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div className="me-1">{item.ItemCode}</div>
                                    <div className="text-secondary">{item.ItemCodeDesc}</div>
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                )}
            </div>
        </div>
    )
}
