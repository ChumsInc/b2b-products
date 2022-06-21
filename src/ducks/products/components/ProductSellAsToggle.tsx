import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "../selectors";
import classNames from "classnames";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_SELF, SELL_AS_VARIANTS} from "../constants";
import {updateProductAction} from "../actions";
import {ProductSellAs} from "b2b-types/src/products";
import {useAppDispatch} from "../../../app/hooks";

const ProductSellAsToggle: React.FC = () => {
    const dispatch = useAppDispatch();
    const {sellAs} = useSelector(selectCurrentProduct);

    const cSellAsSelf = classNames('btn btn-sm', {
        'btn-sell-as-self': sellAs === SELL_AS_SELF,
        'btn-outline-sell-as-self': sellAs !== SELL_AS_SELF
    });
    const cSellAsVariants = classNames('btn btn-sm', {
        'btn-sell-as-variants': sellAs === SELL_AS_VARIANTS,
        'btn-outline-sell-as-variants': sellAs !== SELL_AS_VARIANTS
    });
    const cSellAsMix = classNames('btn btn-sm', {
        'btn-sell-as-mix': sellAs === SELL_AS_MIX,
        'btn-outline-sell-as-mix': sellAs !== SELL_AS_MIX
    });
    const cSellAsColors = classNames('btn btn-sm', {
        'btn-sell-as-colors': sellAs === SELL_AS_COLORS,
        'btn-outline-sell-as-colors': sellAs !== SELL_AS_COLORS
    });

    const clickHandler = (sellAs: ProductSellAs) => dispatch(updateProductAction({sellAs: sellAs}));
    return (
        <div className="btn-group btn-group-smp">
            <button type="button" className={cSellAsVariants} onClick={() => clickHandler(SELL_AS_VARIANTS)}>Variants
            </button>
            <button type="button" className={cSellAsSelf} onClick={() => clickHandler(SELL_AS_SELF)}>Self</button>
            <button type="button" className={cSellAsMix} onClick={() => clickHandler(SELL_AS_MIX)}>Mix</button>
            <button type="button" className={cSellAsColors} onClick={() => clickHandler(SELL_AS_COLORS)}>Colors</button>
        </div>
    )
}

export default ProductSellAsToggle;
