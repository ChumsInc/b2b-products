import React, {useEffect, useState} from 'react';
import Modal from "chums-components/dist/Modal";
import Editor, {useMonaco} from '@monaco-editor/react';
import {FormCheck} from "chums-components";
import {LocalStore, storeWordWrap} from "../../localStore";


interface ModalEditorProps {
    title: string,
    content: string,
    onClose: (content: string) => void,
    onCancel: () => void,
}

const ModalEditor = ({title, content, onClose, onCancel}:ModalEditorProps) => {
    const [html, setHTML] = useState(content || '');
    const [wordWrap, setWordWrap] = useState<boolean>(LocalStore.getItem<boolean>(storeWordWrap, false) ?? false);

    useEffect(() => {
        LocalStore.setItem(storeWordWrap, wordWrap);
    }, [wordWrap]);

    useEffect(() => {
        setHTML(content);
    }, [content]);

    return (
        <Modal onClose={onCancel} size="lg" title={title}>
            <Editor onChange={(value) => setHTML(value ?? '')} value={html} height="50vh" defaultLanguage="html" options={{wordWrap: wordWrap ? 'on' : 'off'}} />
            <div className="row g-3">
                <div className="col-auto">
                    <button onClick={() => onClose(html)} className="btn btn-sm btn-primary me-1">
                        Close / Apply Changes
                    </button>
                </div>
                <div className="col-auto">
                    <button onClick={() => onCancel()} className="btn btn-sm btn-secondary">Cancel</button>
                </div>
                <div className="col-auto">
                    <FormCheck type="checkbox" checked={wordWrap} onChange={(ev) => setWordWrap(ev.target.checked)} label="Word Wrap" />
                </div>
            </div>
        </Modal>
    )
};

export default ModalEditor;
