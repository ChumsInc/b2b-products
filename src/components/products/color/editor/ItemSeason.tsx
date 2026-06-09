import {Col, Form, InputGroup, Row} from "react-bootstrap";
import SeasonSelect from "@/components/season/SeasonSelect.tsx";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductColorItem, ProductSeason} from "chums-types/b2b";
import {type ChangeEvent, useId} from "react";

export default function ItemSeason() {
    const {value, updateValue} = useEditorContext<ProductColorItem>();
    const seasonId = useId();
    const seasonAvailableId = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({additionalData: {...value.additionalData, seasonAvailable: ev.target.checked}});
    }
    const seasonChangeHandler = (season: ProductSeason | null) => {
        updateValue({
            additionalData: {
                ...value.additionalData,
                season_id: season?.product_season_id ?? null,
                season: season || undefined,
            }
        });
    }

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column xs={4} htmlFor={seasonId}>Season</Form.Label>
            <Col>
                <InputGroup size="sm">
                    <SeasonSelect id={seasonId} value={value.additionalData?.season?.code || ''}
                                  onChange={seasonChangeHandler}/>
                    <InputGroup.Text as="label" htmlFor={seasonAvailableId}>Available</InputGroup.Text>
                    <InputGroup.Checkbox id={seasonAvailableId}
                                         checked={value.additionalData?.seasonAvailable ?? false}
                                         onChange={changeHandler}
                                         disabled={!value.additionalData?.season_id}/>
                </InputGroup>
            </Col>
        </Form.Group>
    )
}
