import React, {useEffect} from 'react';
import {Nav, NavProps} from "react-bootstrap";
import {Link, useMatch} from "react-router";

export default function AppTabs(props: NavProps) {
    const match = useMatch({path: '/:tab', end: false});

    useEffect(() => {
        console.log(match?.params.tab);
    }, [match]);

    return (
        <Nav variant="tabs" activeKey={match?.params.tab ?? 'products'} {...props}>
            <Nav.Item>
                <Nav.Link as={Link} to="/products" eventKey="products">
                    Products
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="/colors" eventKey="colors">
                    Colors
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="/where-used" eventKey="where-used">
                    Where Used
                </Nav.Link>
            </Nav.Item>
        </Nav>
    )
}
