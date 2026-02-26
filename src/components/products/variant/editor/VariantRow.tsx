import {Col, Form, type FormLabelProps, Row} from "react-bootstrap";
import {type ReactNode} from "react";

const defaultLabelProps: FormLabelProps = {column: true, xs: 4, lg: 3, className: 'text-secondary'};

export interface VariantRowProps {
    labelProps: FormLabelProps;
    label: string;
    children: ReactNode;
}

export default function VariantRow({labelProps, label, children}: VariantRowProps) {
    const props = {...defaultLabelProps, ...labelProps};
    return (
        <Form.Group as={Row} className="align-items-baseline">
            <Form.Label {...props}>{label}</Form.Label>
            <Col>
                {children}
            </Col>
        </Form.Group>
    )
}
