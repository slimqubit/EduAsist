// src/components/ConfirmDialog.tsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { apiClient } from "../services/apiService";
import { storageService } from "../services/storageService";
import { Link } from 'react-router-dom';

interface School {
    id: number;
    name: string;
}

interface SelectSchoolDialogProps {
    showModal: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const SelectSchoolDialog: React.FC<SelectSchoolDialogProps> = ({
    showModal,
    onConfirm,
    onCancel,
}) => {
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState<School[]>([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (showModal) {
            fetchSchools();
        }
    }, [showModal]);

    useEffect(() => {
        const selectedSchool = storageService.getSelectedSchool();
        const schoolId = selectedSchool ? selectedSchool.id : null;
        setSelectedSchoolId(schoolId);
    }, []);


    const fetchSchools = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("/api/schools");
            if (response.status === 200) {
                setSchools(response.data);
            } else {
                setError(response?.data?.message || "An error occurred.");
                setSchools([]);
            }
        } catch (error) {
            setError(`An error occurred. ${error}`);
            setSchools([]);
        } finally {
            setLoading(false);
        }
    };

    /*
        const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const schoolId = parseInt(e.target.value, 10) || null;
            setSelectedSchoolId(schoolId);
            
            if (schoolId !== null) {
                storageService.setSelectedSchool(schoolId);
            } else {
                storageService.removeSelectedSchool();
            }
        };
    */

    const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const schoolId = parseInt(e.target.value, 10) || null;
        setSelectedSchoolId(schoolId);
    };

    const handleConfirm = () => {
        const selected = schools.find((school) => school.id === selectedSchoolId) || null;

        if (selected) {
            storageService.setSelectedSchool(selected);
        } else {
            storageService.removeSelectedSchool();
        }

        window.location.reload(); // reloads the page to reflect the selected company
        onConfirm();
    };


    const noData = !loading && schools.length === 0;

    return (
        <Modal
            show={showModal}
            onHide={onCancel}
            backdrop="static"
            // size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Alegeți școala</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert key="danger" variant="danger"><i className="bi bi-exclamation-triangle"></i>{' '}{error}</Alert>}
                <Form.Group controlId="schoolSelector">
                    {noData ?
                        (
                            <>
                                <Alert key="warning " variant="warning ">
                                    <i className="bi bi-exclamation-triangle me-2"></i>Pentru acest cont de utilizator nu a fost introdusă nici o unitate de învățământ.
                                </Alert>
                                <div className="mb-3 d-flex justify-content-end">
                                    <Link to="/school_edit" onClick={onCancel} className="btn btn-primary btn-sm">Adaugă o școală nouă</Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Form.Label>Alegeți unitatea de învățământ</Form.Label>
                                <Form.Select
                                    as="select"
                                    value={selectedSchoolId || ""}
                                    onChange={handleSchoolChange}
                                    disabled = {loading}
                                >
                                    {loading
                                        ? (<option value="">Încarc lista școlilor ...</option>)
                                        : (<option value="">Alege o școală ...</option>
                                        )}

                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </>
                        )}
                </Form.Group>


            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Renunță
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirmă
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const useSelectSchoolDialog = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => () => { });

    const confirm = (): Promise<boolean> => {
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

    const SelectSchoolDialogComponent = (
        <SelectSchoolDialog
            showModal={showDialog}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return { confirm, SelectSchoolDialogComponent };
};

export default useSelectSchoolDialog;
