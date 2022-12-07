import React, {HTMLAttributes} from 'react';
import {useSelector} from "react-redux";
import {selectColorList} from "./selectors";

export interface ColorDataListProps extends HTMLAttributes<HTMLDataListElement> {
    id: string,
}

const ColorDataList:React.FC<ColorDataListProps> = ({id, ...props}) => {
    const colors = useSelector(selectColorList);
    return (
        <datalist id={id} {...props} >
            {Object.values(colors).map(c => <option key={c.id} value={c.code}>{c.code} / {c.name}</option>)}
        </datalist>
    );
}

export default ColorDataList;
