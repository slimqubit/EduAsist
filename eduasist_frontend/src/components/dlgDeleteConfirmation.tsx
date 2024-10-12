// src/components/ConfirmDialog.tsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmDialogProps {
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDialogProps> = ({ show, title, message, onConfirm, onCancel }) => {
    return (
        <Modal show={show} onHide={onCancel} backdrop="static"
            // size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body><p>
                {message.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                        {line}<br />
                    </React.Fragment>
                ))}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Renunță</Button>
                <Button variant="danger" onClick={onConfirm}>Șterge</Button>
            </Modal.Footer>
        </Modal>
    );
};

const useConfirmDeleteDialog = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [message, setMessage] = useState("");
    const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => () => { });

    const confirmDelete = (customMessage: string): Promise<boolean> => {
        setMessage(customMessage);
        setShowDialog(true);
        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const handleConfirm = () => {
        setShowDialog(false);
        resolvePromise(true);
    };

    const handleCancel = () => {
        setShowDialog(false);
        resolvePromise(false);
    };

    const ConfirmDeleteDialogComponent = (
        <ConfirmDeleteDialog
            show={showDialog}
            title="Confirmă ștergerea"
            message={message}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return { confirmDelete, ConfirmDeleteDialogComponent };
};

export default useConfirmDeleteDialog;
