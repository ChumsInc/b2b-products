import React, {useEffect, useState} from 'react';
import Modal from "chums-components/dist/Modal";
import ReactAce from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";

interface ModalEditorProps {
    title: string,
    content: string,
    onClose: (content: string) => void,
    onCancel: () => void,
}

const ModalEditor = ({title, content, onClose, onCancel}:ModalEditorProps) => {
    const [html, setHTML] = useState(content || '');

    useEffect(() => {
        setHTML(content);
    }, [content]);

    return (
        <Modal onClose={onClose} size="lg" title={title}>
            <ReactAce mode="html" value={html} tabSize={4} wrapEnabled width="100%" focus={true}
                      name="modal-editor-ace" theme="github"
                      setOptions={{useWorker: false}}
                      onChange={(value => setHTML(value))}/>
            <div>
                <button onClick={() => onClose(html)} className="btn btn-sm btn-primary me-1">Close / Apply Changes
                </button>
                <button onClick={() => onCancel()} className="btn btn-sm btn-secondary">Cancel</button>
            </div>
        </Modal>
    )
};

export default ModalEditor;
