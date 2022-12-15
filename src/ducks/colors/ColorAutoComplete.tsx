import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {selectColorList} from "./selectors";
import {usePopper} from "react-popper";
import {ProductColor} from "b2b-types";
import useClickOutside from "../../hooks/click-outside";
import classNames from "classnames";
import {parseColor} from "../../utils";

export interface ColorAutoCompleteProps {
    value: string;
    swatchFormat?: string|null;
    onChange?: (value: string) => void;
    onChangeColor?: (color: ProductColor) => void;
}

const ColorAutoComplete = ({value, swatchFormat, onChange, onChangeColor}: ColorAutoCompleteProps) => {
    const colorList = useSelector(selectColorList);
    const containerRef = useRef<HTMLDivElement>(null);

    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
    const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

    const [colors, setColors] = useState(Object.values(colorList));
    const [color, setColor] = useState<ProductColor | null>(colorList[value] ?? null);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(-1);
    const {styles, attributes} = usePopper(inputElement, popperElement, {
        modifiers: [{name: 'arrow', options: {element: arrowElement}}],
    });

    useClickOutside(containerRef, () => setOpen(false));

    useEffect(() => {
        const colors = Object.values(colorList);
        setColors(colors.filter(color => color.code.toLowerCase().startsWith(value.toLowerCase()) || color.name.toLowerCase().includes(value.toLowerCase())));
        setColor(colorList[value] ?? null);
        setIndex(-1);
    }, [value])

    const clickHandler = (color: ProductColor) => {
        setOpen(false);
        if (onChangeColor) {
            return onChangeColor(color);
        }
        if (onChange) {
            onChange(color.code);
        }
    }

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const color: ProductColor = colorList[ev.target.value] ?? {code: ev.target.value, name: '', id: 0};
        if (onChangeColor) {
            return onChangeColor(color);
        }
        if (onChange) {
            onChange(ev.target.value);
        }
    }

    const inputHandler = (ev: KeyboardEvent<HTMLInputElement>) => {
        const len = Math.min(colors.length, 25);
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
            const current = colors[index];
            if (!open) {
                return;
            }
            if (current && onChangeColor) {
                return onChangeColor(current);
            }
            if (onChange) {
                onChange(current.code);
            }
        }
    }
    return (
        <div ref={containerRef}>
            <div className="input-group input-group-sm">
                <input type="search" className="form-control form-control-sm" value={value} onChange={changeHandler}
                       onKeyDown={inputHandler}
                       ref={setInputElement} onFocus={() => setOpen(true)}/>
                <div className={classNames('input-group-text color-swatch', {[parseColor(`color-swatch--${swatchFormat || '?'}`, color?.code)]: !!color?.code})} />
            </div>
            {open && (
                <div ref={setPopperElement} style={{
                    height: '20rem',
                    width: '30rem',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    zIndex: 1000,
                    ...styles.popper,
                }} {...attributes.popper} >
                    <div ref={setArrowElement} style={styles.arrow}/>
                    <ul className={classNames('list-group fade', {show: open})}>
                        {open && colors
                            .slice(0, 25)
                            .map((color, i) => (
                                <li key={color.code} className={classNames("list-group-item", {active: index === i})}
                                    style={{display: 'flex', justifyContent: 'space-between'}}
                                    onClick={() => clickHandler(color)}>
                                    <div>{color.code}</div>
                                    <div>{color.name}</div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}

        </div>
    )
}

export default ColorAutoComplete;
