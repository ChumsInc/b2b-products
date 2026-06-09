import {Badge, Card} from "react-bootstrap";
import SeasonIcon from "@/components/season/SeasonIcon.tsx";
import ColorSwatch from "@/components/colors/ColorSwatch.tsx";
import classNames from "classnames";
import numeral from "numeral";
import type {ProductColorItem} from "chums-types/b2b";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProduct} from "@/ducks/products/productSlice.ts";
import ProductImage from "@/components/app/ProductImage.tsx";

export interface ProductItemCardProps {
    item: ProductColorItem;
    isCurrentItem?: boolean;
    onSelectItem?: (item: ProductColorItem) => void;
}

export default function ProductItemCard({item, isCurrentItem, onSelectItem}: ProductItemCardProps) {
    const product = useAppSelector(selectCurrentProduct);

    const cardClickHandler = () => {
        if (onSelectItem) {
            onSelectItem(item);
        }
    }
    return (
        <Card border={isCurrentItem ? 'primary' : 'secondary'}
              onClick={cardClickHandler}>
            <Card.Header className="p-1">
                <div className="d-flex justify-content-between align-items-baseline">
                    <div>
                        {item.colorCode}
                    </div>
                    {!item.inactiveItem && (
                        <SeasonIcon code={item.additionalData?.season?.code}
                                    seasonAvailable={item.additionalData?.seasonAvailable === true}/>
                    )}
                    {!item.inactiveItem && !item.status && (
                        <Badge bg="secondary">Off</Badge>
                    )}
                    {!item.inactiveItem && !!item.productStatus && (
                        <Badge bg="warning">{item.productStatus}</Badge>)}
                    {item.inactiveItem && (<Badge bg="danger">Inactive</Badge>)}
                    <ColorSwatch colorCode={item.colorCode}
                                 swatchFormat={item.additionalData?.swatch_code ?? product?.additionalData?.swatch_format}>
                        &nbsp;
                    </ColorSwatch>
                </div>
            </Card.Header>
            <Card.Body className="text-center">
                <ProductImage filename={item.additionalData?.image_filename ?? product?.image ?? null}
                              className={classNames('m-auto', {'text-danger': !item.status})}
                              colorCode={item.colorCode} itemCode={item.itemCode} size={80}/>
            </Card.Body>
            <Card.Footer className="text-center">
                <small
                    className="text-secondary">Available: {numeral(item.QuantityAvailable).format('0,0')}</small>
            </Card.Footer>
        </Card>
    )
}
