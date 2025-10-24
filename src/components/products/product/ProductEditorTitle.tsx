import classNames from "classnames";
import Spinner from "react-bootstrap/Spinner";
import {
    selectCurrentProduct,
    selectCurrentProductChanged,
    selectCurrentProductLoading
} from "@/ducks/products/productSlice.ts";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "@/components/app/ErrorFallbackComponent";
import {useAppSelector} from "@/app/configureStore.ts";


const ProductEditorTitle = () => {
    const product = useAppSelector(selectCurrentProduct);
    const loading = useAppSelector(selectCurrentProductLoading);
    const changed = useAppSelector(selectCurrentProductChanged);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <Row className="align-items-baseline">
                <Col as="h2" xs="auto" className={classNames('me-3', {'text-warning': changed})}>
                    {product?.name || 'Product Editor'}
                </Col>
                {product?.additionalData?.subtitle && (
                    <Col xs="auto" className="me-3 text-secondary">
                        {product.additionalData.subtitle ?? null}
                    </Col>
                )}
                <Col className="col">
                    {changed && <span className="text-warning  bi-exclamation-triangle-fill ms-1"/>}
                </Col>
                <Col xs="auto">
                    {loading && (
                        <Spinner className="ms-3" variant="primary" animation="border" size="sm"/>
                    )}
                </Col>
            </Row>
        </ErrorBoundary>
    )
}

export default ProductEditorTitle;
