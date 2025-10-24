import {selectWhereUsedProducts} from "@/ducks/where-used/selectors";
import classNames from "classnames";
import {useAppSelector} from "@/app/configureStore.ts";

const WhereUsedProducts = () => {
    const products = useAppSelector(selectWhereUsedProducts);

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
