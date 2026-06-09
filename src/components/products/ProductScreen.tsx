import ProductTable from "./list/ProductTable";
import {Outlet} from "react-router";
import ProductTableFilterBar from "./list/ProductTableFilterBar";
import ProductsLoading from "./list/ProductsLoading";
import {Group, Panel, Separator, useDefaultLayout} from 'react-resizable-panels';
import TableResponsiveContainer from "@/components/common/TableResponsiveContainer.tsx";

const ProductScreen = () => {
    const {onLayoutChanged, defaultLayout} = useDefaultLayout({
        id: 'b2b-products:product-screen-layout',
        storage: localStorage,
    })
    return (
        <Group defaultLayout={defaultLayout} onLayoutChange={onLayoutChanged}>
            <Panel defaultSize="50%" className="container" id="product-list-panel">
                <ProductTableFilterBar/>
                <ProductsLoading/>
                <TableResponsiveContainer>
                    <ProductTable/>
                </TableResponsiveContainer>
            </Panel>
            <Separator className="bg-body-secondary rounded-1" style={{minWidth: '10px'}}/>
            <Panel className="container" defaultSize="50%" id="product-detail-panel">
                <Outlet/>
            </Panel>
        </Group>
    )
}

export default ProductScreen;
