import {ProgressBar} from "react-bootstrap";
import {selectProductListLoading} from "@/ducks/productList/productListSlice.ts";
import {useAppSelector} from "@/app/configureStore.ts";

export default function ProductsLoading() {
    const loading = useAppSelector(selectProductListLoading);

    return (
        <div style={{height: '5px'}} className="mb-1">
            {loading && (
                <ProgressBar striped animated now={loading ? 100 : 0} style={{height: '100%'}}/>
            )}
        </div>
    )
}
