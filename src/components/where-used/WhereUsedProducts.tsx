import React from 'react';
import {useSelector} from "react-redux";
import {selectWhereUsedProducts} from "../../ducks/where-used/selectors";
import classNames from "classnames";

const WhereUsedProducts = () => {
    const products = useSelector(selectWhereUsedProducts);

    return (
        <table className="table table-xs">
            <thead>
            <tr>
                <th>Product ID</th>
                <th>Keyword</th>
            </tr>
            </thead>
            <tbody>
            {products.map(row => (
                <tr key={row.id} className={classNames({'table-danger': !row.active})}>
                    <td>{row.id}</td>
                    <td>{row.keyword}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
export default WhereUsedProducts;
