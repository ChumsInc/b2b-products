import React, {FormEvent, useEffect, useId, useState} from 'react';
import {useAppDispatch} from "../app/hooks";
import {useSelector} from "react-redux";
import {selectWhereUsedLoading, selectWhereUsedSearch} from "@/ducks/where-used/selectors";
import WhereUsedProducts from "./WhereUsedProducts";
import WhereUsedCategories from "./WhereUsedCategories";
import {loadWhereUsed} from "@/ducks/where-used/actions";
import {Button, Col, Form, FormControl, ProgressBar, Row} from "react-bootstrap";

const WhereUsedPage = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectWhereUsedSearch);
    const loading = useSelector(selectWhereUsedLoading);
    const id = useId();
    const [value, setValue] = useState<string>(search);

    useEffect(() => {
        setValue(search);
    }, [search]);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(loadWhereUsed(value));
    }

    return (
        <div className="container">
            <Row as="form" onSubmit={submitHandler}>
                <Form.Label column={true} xs="auto" htmlFor={id}>Item Code</Form.Label>
                <Col xs="auto">
                    <FormControl type="search" size="sm" value={value}
                                 onChange={(ev) => setValue(ev.target.value)}/>
                </Col>
                <Col xs="auto">
                    <Button type="submit" variant="primary" size="sm" disabled={loading}>Load</Button>
                </Col>
            </Row>
            <div className="mb-3">
                {loading && (
                    <ProgressBar now={100} striped animated/>
                )}
            </div>
            <div className="row g-3">
                <div className="col">
                    <h3>Products</h3>
                    <WhereUsedProducts/>
                </div>
                <div className="col">
                    <h3>Category Pages</h3>
                    <WhereUsedCategories/>
                </div>
            </div>
        </div>
    )
}

export default WhereUsedPage;
