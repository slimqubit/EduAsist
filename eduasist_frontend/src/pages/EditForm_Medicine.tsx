// src/components/AddStudentForm.tsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

import { LoadingData } from '../components/cmpUtils';

import { apiClient } from '../services/apiService';
import { useLocation, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';

import { MedicineAutocomplete, MedicineTable } from '../components/cmpMedicine';

import { Product, ProductAdd, ProductMove, TypeUnit } from '../types/types';



interface AddMedicineFormProps {
    onMedicineAdded?: () => void;
}

const AddMedicineForm: React.FC<AddMedicineFormProps> = ({ onMedicineAdded }) => {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const returnTo = location.state?.returnTo || `/`;

    const initialProductAddState = {
        name: '',
        quantity: 0,
        unitId: 0,
        expMonth: '',
        expYear: '',
        dateAdded: new Date().toISOString().split('T')[0],
    };
    const [productAdd, setProductAdd] = useState<ProductAdd>(initialProductAddState);





    const selectedSchool = storageService.getSelectedSchool();
    const schoolId = selectedSchool ? selectedSchool.id : null;

   
    const [products, setProducts] = useState<Product[]>([]);
    const [units, setUnits] = useState<TypeUnit[]>([]);


    const [medNames, setMedNames] = useState<string[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState('');


    const fetchUnits = async () => {
        try {
            const response = await apiClient.get(`/api/types/units`);
            if (response.status == 200) {
                const data = response.data.map((unit: TypeUnit) => ({
                    ...unit,
                }));
                setUnits(data);
            }
            else {
                setError(response?.data?.message || 'An error occurred.');
            }
        } catch (error) {
            setError(`An error occurred. ${error}`);
        }
    };


    const fetchProducts = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }


    const fetchMedNames = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/api/schools/${schoolId}/productNames`);
            if (response.status == 200) {
                const medicineData = response.data.map((medicine: ProductMove) => ({
                    ...medicine,
                }));

                const productNames = medicineData.map((product: { name: any; }) => product.name);
                setMedNames(productNames);
            }
            else {
                setError(response?.data?.message || 'An error occurred.');
                setMedNames([]);
            }
        } catch (error) {
            setError(`An error occurred. ${error}`);
            setMedNames([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {


        fetchMedNames();
        fetchUnits();
        fetchProducts();
    }, []);





    function getLastDayOfMonth(year: number, month: number): number {
        // Create a new Date object with the next month and set the date to 0
        const date = new Date(year, month, 0);
        return date.getDate(); // This will give you the last day of the month
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Combine month and year to create a date string
            const expYear = parseInt(productAdd.expYear);
            const expMonth = parseInt(productAdd.expMonth);

            const lastDayOfMonth = getLastDayOfMonth(expYear, expMonth);
            const expirationDate = `${expYear}-${String(expMonth).padStart(2, '0')}-${lastDayOfMonth}`;

            const medicine: ProductMove = {
                name: selectedMedicine,
                quantity: productAdd.quantity,
                unitId: productAdd.unitId,
                expirationDate: expirationDate,
                movementDate: productAdd.dateAdded,
            };

            const response = await apiClient.post(`/api/schools/${schoolId}/stockIn`, medicine);;
            if (response.status === 201 || response.status === 200) {
                setSelectedMedicine('');
                setProductAdd(initialProductAddState);
                fetchMedNames();
                fetchProducts();
                if (typeof onMedicineAdded === 'function') onMedicineAdded();
                navigate(returnTo);
            }
            else {
                setError(response?.data?.message || 'An error occurred.');
            }
        } catch (error: any) {
            if (error.response) {
                // Server responded with a status other than 2xx
                setError(`Error: ${error.response.data.message || 'An error occurred on the server.'}`);
            } else if (error.request) {
                // Request was made, but no response was received
                setError('Error: No response from server.');
            } else {
                // Something else happened
                setError(`Error: ${error.message}`);
            }
        }

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductAdd({ ...productAdd, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProductAdd({ ...productAdd, [e.target.name]: e.target.value });
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h3 className="my-4">Gestiune stoc cabinet medical</h3>
                    {error && <Alert key="danger" variant="danger">{error}</Alert>}

                    <h4 className="fw-light">Situația dispozitivelor medicale pe stoc</h4>
                    <hr className="border-top border-primary my-1 opacity-25" />

                    {loading
                        ? (<LoadingData />)
                        : (
                            <>
                                {products.length > 0 ?
                                    (
                                        <MedicineTable productList={products} />
                                    ) : (
                                        <Alert key="secondary" variant="secondary" className="my-4">
                                            <i className="bi bi-info-circle me-2"></i>
                                            Nu au fost introduse dispozitive medicale.
                                        </Alert>
                                    )
                                }
                            </>
                        )}


                    <h4 className="fw-light mt-5">Adăugare dispozitive medicale</h4>
                    <hr className="border-top border-primary my-1 opacity-25" />

                    <Form className="mb-3 mt-4" onSubmit={handleSubmit}>
                        <Form.Group controlId="formQuantity" className="mb-3">
                            <Form.Label>Denumirea dispozitivului medical</Form.Label>
                            <MedicineAutocomplete
                                medicines={medNames}
                                selectedMedicine={selectedMedicine}
                                setSelectedMedicine={setSelectedMedicine}
                            />
                        </Form.Group>


                        <Row>
                            <Col className="col-md-2">
                                <Form.Group controlId="formQuantity" className="mb-3">
                                    <Form.Label>Cantitate</Form.Label>
                                    <Form.Control
                                        className='no-spinner'
                                        type="number"
                                        name="quantity"
                                        value={productAdd.quantity}
                                        onChange={handleChange}
                                        placeholder="Luna"
                                        min="1" required
                                    />
                                </Form.Group>
                            </Col >
                            <Col className="col-md-4">
                                <Form.Group controlId="formUnit" className="mb-3">
                                    <Form.Label>Unitate de măsură</Form.Label>
                                    <Form.Select name='unitId' value={productAdd.unitId} onChange={handleSelectChange} required>
                                        <option value="">Alegeți U/m ...</option>
                                        {units.map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.unit}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className="col-md-3">
                                <Form.Group controlId="formExpirationDate" className="mb-3">
                                    <Form.Label>Data expirării</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control
                                            className='me-1 no-spinner'
                                            type="number"
                                            name="expMonth"
                                            value={productAdd.expMonth}
                                            onChange={handleChange}
                                            placeholder="Luna"
                                            min={1} max={12}
                                            required
                                        />

                                        <Form.Control
                                            className='m2-1 no-spinner'
                                            type="number"
                                            name="expYear"
                                            value={productAdd.expYear}
                                            onChange={handleChange}
                                            placeholder="Anul"
                                            min={2024}
                                            required
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col className="col-md-3">
                                <Form.Group controlId="dateAdded" className="mb-3">
                                    <Form.Label>Data achiziției</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dateAdded"
                                        value={productAdd.dateAdded}
                                        onChange={handleChange}
                                        placeholder="dd.MM.yyyy"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="mb-3 d-flex justify-content-end">
                            {/*            <Button variant="primary" type="submit" disabled={!schoolId} >Adăugare</Button>*/}
                            <Button variant="primary" type="submit" >Adăugare</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};


export default AddMedicineForm;
