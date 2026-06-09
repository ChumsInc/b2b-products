import type {ProductColorItem} from "chums-types/b2b";
import {Col, Row} from "react-bootstrap";
import useProductItems from "@/components/products/color/useProductItems.ts";
import ProductItemCard from "@/components/products/color/list/ProductItemCard.tsx";

export interface ProductColorGridProps {
    list: ProductColorItem[];
}

export default function ProductColorGrid({list}: ProductColorGridProps) {
    const {currentItem, setCurrentItem} = useProductItems();

    return (
        <Row className="g-3">
            {list
                .map(item => (
                    <Col key={item.id} xs={12} sm={6} md={4} lg="auto"
                         style={{minWidth: '175px'}}>
                        <ProductItemCard item={item} isCurrentItem={currentItem?.id === item.id}
                                         onSelectItem={setCurrentItem}/>
                    </Col>
                ))}
        </Row>
    )
}
