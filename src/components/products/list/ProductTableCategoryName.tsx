import React from 'react';
import {useSelector} from "react-redux";
import {selectKeywordsList} from "../../../ducks/keywords/selectors";

const ProductTableCategoryName = ({categoryId}: {
    categoryId?: number|string|null;
}) => {
    const categories = useSelector(selectKeywordsList);
    const [cat] = categories.filter(cat => cat.pagetype === 'category').filter(cat => cat.id === categoryId);
    if (!categoryId || !cat) {
        return null;
    }
    return (
        <>{cat.keyword}</>
    )
}

export default ProductTableCategoryName;
