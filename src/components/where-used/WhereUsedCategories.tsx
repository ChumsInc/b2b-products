import {selectWhereUsedCategories} from "@/ducks/where-used/selectors";
import classNames from "classnames";
import {useAppSelector} from "@/app/configureStore.ts";

const WhereUsedCategories = () => {
    const categories = useAppSelector(selectWhereUsedCategories);

    return (
        <table className="table table-xs">
            <thead>
            <tr>
                <th>Category ID</th>
                <th>Keyword</th>
            </tr>
            </thead>
            <tbody>
            {categories.map(row => (
                <tr key={row.id} className={classNames({'table-danger': !row.active})}>
                    <td>{row.id}</td>
                    <td>{row.keyword}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
export default WhereUsedCategories;
