import React, {ChangeEvent, KeyboardEvent, useEffect, useId, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {selectColorList} from "@/ducks/colors/selectors";
import {useFloating} from '@floating-ui/react-dom'
import {ProductColor} from "b2b-types";
import useClickOutside from "../../hooks/click-outside";
import classNames from "classnames";
import {FormControl, FormControlProps, InputGroup, InputGroupProps, ListGroup} from "react-bootstrap";
import ColorSwatch from "./ColorSwatch";

export interface ColorAutoCompleteProps extends InputGroupProps {
    value: string;
    id?: string;
    inputProps?: Omit<FormControlProps, 'value'>;
    label?: string;
    swatchFormat?: string | null;
    onChangeColor: (color: ProductColor) => void;
}

const ColorAutoComplete = ({
                               value,
                               label,
                               id,
                               inputProps,
                               swatchFormat,
                               onChangeColor,
                               ...rest
                           }: ColorAutoCompleteProps) => {
    const colorList = useSelector(selectColorList);
    const containerRef = useRef<HTMLDivElement>(null);

    const [colors, setColors] = useState(Object.values(colorList));
    const [color, setColor] = useState<ProductColor | null>(colorList[value] ?? null);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(-1);
    const {refs, floatingStyles} = useFloating({placement: 'bottom-start'});
    const inputId = id ?? useId();

    useClickOutside(containerRef, () => setOpen(false));

    useEffect(() => {
        const colors = Object.values(colorList);
        setColors(colors.filter(color => color.code.toLowerCase().startsWith(value.toLowerCase()) || color.name.toLowerCase().includes(value.toLowerCase())));
        setColor(colorList[value] ?? null);
        setIndex(-1);
    }, [value])

    const clickHandler = (color: ProductColor) => {
        onChangeColor(color);
        setOpen(false);
    }

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const color: ProductColor = colorList[ev.target.value] ?? {code: ev.target.value, name: '', id: 0};
        if (color) {
            return onChangeColor(color);
        }
        if (inputProps?.onChange) {
            inputProps.onChange(ev);
        }
    }

    const inputHandler = (ev: KeyboardEvent<HTMLInputElement>) => {
        const len = Math.min(colors.length, 25);
        let current: ProductColor | null = null;
        console.log(ev.key);
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
                current = colors[index];
                if (!open) {
                    return;
                }
                if (current) {
                    return onChangeColor(current);
                }
                return;
            default:
                if (inputProps?.onKeyDown) {
                    inputProps.onKeyDown(ev);
                }
        }
    }

    return (
        <div ref={containerRef}>
            <InputGroup className="input-group input-group-sm" {...rest} ref={refs.setReference}>
                {label && <InputGroup.Text as="label" htmlFor={inputId}>{label}</InputGroup.Text>}
                <InputGroup.Text className={classNames("input-group-text", {
                    'text-danger': !color?.id,
                    'text-success': !!color?.id
                })}>
                    <span className={classNames(color?.id ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-down-fill', {
                        'bi-hand-thumbs-up-fill': !!color?.id,
                        'bi-hand-thumbs-down-fill': !!value && !color?.id,
                        'bi-hand-thumbs-down': !value && !color?.id,
                    })}/>
                </InputGroup.Text>
                <FormControl type="search" size="sm" id={inputId} value={value} autoComplete="off"
                             {...inputProps}
                             onChange={changeHandler}
                             onKeyDown={inputHandler}
                             onFocus={() => setOpen(true)}/>
                <InputGroup.Text as="div">
                    <ColorSwatch colorCode={color?.code} swatchFormat={swatchFormat} style={{height: '100%'}}/>
                </InputGroup.Text>
            </InputGroup>
            {open && (
                <div ref={refs.setFloating} style={{
                    height: '20rem',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    zIndex: 1000,
                    ...floatingStyles,
                }}>
                    <ListGroup>
                        {colors.slice(0, 25)
                            .map((color, i) => (
                                <ListGroup.Item key={color.code} active={index === i}
                                                style={{display: 'flex', justifyContent: 'space-between'}}
                                                onClick={() => clickHandler(color)}>
                                    <div className="me-1">{color.code}</div>
                                    <div className="text-secondary">{color.name}</div>
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                </div>
            )}

        </div>
    )
}

export default ColorAutoComplete;
