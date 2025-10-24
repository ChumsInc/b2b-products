import {useAppSelector} from "@/app/configureStore";
import {selectCurrentMixBOMHeader} from "@/ducks/products/productMixBOMSlice";
import dayjs from "dayjs";
import BOMDetailTable from "@/components/products/mix/BOMDetailTable";

const BOMDetail = () => {
    const header = useAppSelector(selectCurrentMixBOMHeader);

    if (!header) {
        return null;
    }
    return (
        <div>
            <table className="table mb-3">
                <tbody>
                <tr>
                    <th scope="row">Name</th>
                    <td>{header.BillDesc1}</td>
                </tr>
                <tr>
                    <th scope="row">Subtitle</th>
                    <td>{header.BillDesc2}</td>
                </tr>
                <tr>
                    <th scope="row">Sales U/M</th>
                    <td>{header.SalesUnitOfMeasure}</td>
                </tr>
                <tr>
                    <th scope="row">Last Updated</th>
                    <td>{dayjs(header.DateUpdated).format('DD MMM YYYY')}</td>
                </tr>
                </tbody>
            </table>
            <BOMDetailTable/>
        </div>
    )
}

export default BOMDetail;
