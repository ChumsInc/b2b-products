import { useEditorContext } from "@/hooks/editor/useEditorContext";
import type { ProductColorItem } from "chums-types/b2b";
import { useId, type ChangeEvent } from "react";
import {Badge, Col, Form, FormCheck, Row, Stack} from "react-bootstrap";

export default function ItemStatus() {
  const { value, updateValue } = useEditorContext<ProductColorItem>();
  const statusId = useId();

  const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    updateValue({ status: ev.target.checked });
  };

  return (
    <Form.Group as={Row} className="align-items-center">
      <Form.Label column xs={4}>
        Status
      </Form.Label>
      <Col xs="auto">
        <FormCheck
          type="checkbox"
          id={statusId}
          checked={value.status}
          onChange={changeHandler}
          label="Enabled"
        />
      </Col>
      <Col xs="auto">
          <Stack direction="horizontal" gap={1}>
              {!(value.inactiveItem || value.productType === "D") && (
                  <Badge bg="info">{value.productType}</Badge>
              )}
              {(value.inactiveItem || value.productType === "D") && (
                  <Badge bg="danger">Inactive</Badge>
              )}
              {!!value.productStatus && (
                  <Badge bg="warning" className="text-dark">{value.productStatus}</Badge>
              )}
          </Stack>
      </Col>
    </Form.Group>
  );
}
