import {useEffect, useId, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Editor from '@monaco-editor/react';
import FormCheck from "react-bootstrap/FormCheck";
import {LocalStore, storeWordWrap} from "@/api/localStore";
import {Button, Col, Row} from "react-bootstrap";


interface ModalEditorProps {
    show: boolean;
    title: string,
    content: string,
    onClose: (content: string) => void,
    onCancel: () => void,
}

const ModalEditor = ({show, title, content, onClose, onCancel}:ModalEditorProps) => {
    const [html, setHTML] = useState(content || '');
    const [wordWrap, setWordWrap] = useState<boolean>(LocalStore.getItem<boolean>(storeWordWrap, false) ?? false);
    const id = useId();

    useEffect(() => {
        LocalStore.setItem(storeWordWrap, wordWrap);
    }, [wordWrap]);

    useEffect(() => {
        setHTML(content);
    }, [content]);

    return (
        <Modal show={show} onClose={onCancel} size="xl" title={title}>
            <Modal.Header>{title}</Modal.Header>
            <Modal.Body>
                <Editor onChange={(value) => setHTML(value ?? '')} value={html} height="50vh"
                        defaultLanguage="html" options={{wordWrap: wordWrap ? 'on' : 'off'}} />
            </Modal.Body>
            <Modal.Footer>
                <Row gap={3}>
                    <Col xs="auto">
                        <Button onClick={() => onClose(html)} variant="primary" size="sm">
                            Close / Apply Changes
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button onClick={() => onCancel()} variant="outline-secondary" size="sm">Cancel</Button>
                    </Col>
                    <div className="col-auto">
                        <FormCheck type="checkbox" id={id} checked={wordWrap}
                                   onChange={(ev) => setWordWrap(ev.target.checked)} label="Word Wrap" />
                    </div>
                </Row>
            </Modal.Footer>
        </Modal>
    )
};

export default ModalEditor;
