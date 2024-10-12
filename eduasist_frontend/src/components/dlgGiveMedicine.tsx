// src/components/ConfirmDialog.tsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { apiClient } from "../services/apiService";
import { storageService } from "../services/storageService";
import { MedicineSelector } from '../components/cmpMedicine';
import { Product } from '../types/types';




interface ProductGive {
    id: number
    name: string;
    quantity: number;
    unit: string;
    dateAdded: string;
}

interface GiveMedicineDialogProps {
    showModal: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const GiveMedicineDialog: React.FC<GiveMedicineDialogProps> = ({
    showModal,
    onConfirm,
    onCancel,
}) => {
    const [error, setError] = useState<string | null>(null);

    const initialProductGiveState = {
        id: 0,
        name: '',
        quantity: 0,
        unit: '',
        dateAdded: new Date().toISOString().split('T')[0],
    };

    const [productGive, setProductGive] = useState<ProductGive>(initialProductGiveState)
        ;
    const [products, setProducts] = useState<Product[]>([]);
    
    const selectedSchool = storageService.getSelectedSchool();
    const schoolId = selectedSchool ? selectedSchool.id : null;


    useEffect(() => {
        if (showModal) {
            fetchProducts();
        }
    }, [showModal]);

    useEffect(() => {
        //        const selectedSchool = storageService.getSelectedSchool();
        //        const schoolId = selectedSchool ? selectedSchool.id : null;
        //        setSelectedSchoolId(schoolId);
    }, []);


    const fetchProducts = async () => {
        try {
            const response = await apiClient.get(`/api/schools/${schoolId}/products`);

            if (response.status == 200) {
                const productsData = response.data.map((product: Product) => ({
                    ...product,
                }));
                setProducts(productsData);
            }
            else {
                setError(response?.data?.message || 'An error occurred.');
                setProducts([]);
            }
        } catch (error) {
            setError(`An error occurred. ${error}`);
            setProducts([]);
        }
    }

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



    const handleConfirm = () => {
        //const selected = schools.find((school) => school.id === selectedSchoolId) || null;

        //if (selected) {
        //    storageService.setSelectedSchool(selected);
        //} else {
        //    storageService.removeSelectedSchool();
        //}

        window.location.reload(); // reloads the page to reflect the selected company
        onConfirm();
    };


    //const noData = !loading && schools.length === 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductGive({ ...productGive, [e.target.name]: e.target.value });
    };



    const handleProductSelect = (product: Product) => {
        setProductGive(prevState => ({
            ...prevState,
            name: product.name,
            unit: product.type_unit.unit,
        }));
    };

    return (
        <Modal
            show={showModal}
            onHide={onCancel}
            backdrop="static"
            //size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Alegeți medicamentul</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert key="danger" variant="danger"><i className="bi bi-exclamation-triangle"></i>{' '}{error}</Alert>}

                <Row >
                    <Col className="col-md-12">
                        <Form.Group controlId="formQuantity" className="mb-3">
                            <Form.Label>Denumire medicament</Form.Label>
                            <MedicineSelector
                                products={products}
                                onProductSelect={handleProductSelect}
                            />
                        </Form.Group>
                    </Col>
                </Row>


                <Row >
                    <Col className="col-md-3">
                        <Form.Group controlId="formQuantity" className="mb-3">
                            <Form.Label>Cantitate</Form.Label>
                            <Form.Control
                                className='no-spinner'
                                type="number"
                                name="quantity"
                                value={productGive.quantity}
                                onChange={handleChange}
                                placeholder="Luna"
                                min="1" required
                            />
                        </Form.Group>
                    </Col >
                    <Col className="col-md-4">
                        <Form.Group controlId="formUnit" className="mb-3">
                            <Form.Label>Unitate de măsură</Form.Label>
                            <Form.Control
                                className='no-spinner'
                                type="text"
                                name="unit"
                                value={productGive.unit}
                                readOnly
                            />
                        </Form.Group>
                    </Col>

                    <Col className="col-md-5">
                        <Form.Group controlId="dateAdded" className="mb-3">
                            <Form.Label>Data administrarii</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateAdded"
                                value={productGive.dateAdded}
                                onChange={handleChange}
                                placeholder="dd.MM.yyyy"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>


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

const useGiveMedicineDialog = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => () => { });

    const confirmGiveMedicine = (): Promise<boolean> => {
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

    const GiveMedicineDialogComponent = (
        <GiveMedicineDialog
            showModal={showDialog}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return { confirmGiveMedicine, GiveMedicineDialogComponent };
};

export default useGiveMedicineDialog;
