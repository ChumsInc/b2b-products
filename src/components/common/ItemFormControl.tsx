import {type HTMLAttributes, type KeyboardEvent, type RefObject, useEffect, useRef, useState} from 'react';
import {FormControl, type FormControlProps, ListGroup} from "react-bootstrap";
import {useLazyGetItemSearchQuery} from "@/api/items";
import {useFloating} from '@floating-ui/react-dom'
import type {ItemSearchFilter, ItemSearchRecord} from "@/types/item-search";
import useClickOutside from "@/hooks/click-outside";

export interface ItemFormControlProps extends Omit<FormControlProps, 'ref'> {
    value: string;
    onChangeItem: (item: ItemSearchRecord) => void;
    ref?: RefObject<HTMLInputElement | null>;
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
    const _inputRef = useRef<HTMLInputElement | null>(null);
    const inputRef = ref ?? _inputRef;
    const containerRef = useRef<HTMLDivElement>(null);
    const [trigger, result] = useLazyGetItemSearchQuery({});
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(-1);
    const [reference, setReference] = useState<HTMLInputElement | null>(null);
    const {refs, floatingStyles} = useFloating({
        placement: 'bottom-start',
        elements: {
            reference,
        }
    });
    const timerRef = useRef<number>(0);
    const [items, setItems] = useState<ItemSearchRecord[]>([]);

    useClickOutside(containerRef, () => setOpen(false));

    useEffect(() => {
        Promise.resolve().then(() => {
            setReference(inputRef.current);
        })
    }, [inputRef]);


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
    }, [value, filter, lookupDelay, trigger,]);

    useEffect(() => {
        Promise.resolve().then(() => {
            const isFocused = open || document.activeElement === refs.reference.current;
            setItems(result.data ?? []);
            setOpen((result.data ?? []).length > 0 && isFocused);
        })
    }, [result, open, refs.reference]);

    const inputHandler = (ev: KeyboardEvent<HTMLInputElement>) => {
        const len = Math.min(items.length, 25);
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
            case 'Enter': {
                ev.stopPropagation();
                ev.preventDefault();
                const current = items[index];
                if (!open) {
                    return;
                }
                setOpen(false)
                if (onChangeItem) {
                    onChangeItem(current);
                }
            }
        }

    }

    return (
        <div ref={containerRef} {...containerProps}>
            <FormControl ref={refs.setReference} value={value} {...rest} onKeyDown={inputHandler} autoComplete="off"/>
            {/* eslint-disable-next-line react-hooks/refs */}
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
