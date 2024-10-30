// src/pages/SchoolForm.tsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { LoadingData } from '../components/cmpUtils';
import { apiClient } from '../services/apiService';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { School, TypeResidence } from '../types/types';


interface AddSchoolFormProps {
    onSchoolAdded?: () => void;
    onCancel?: () => void;
}


const AddSchoolForm: React.FC<AddSchoolFormProps> = ({ onSchoolAdded, onCancel }) => {

    const { schoolId } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   

    const navigate = useNavigate();

    const location = useLocation();
    const returnTo = location.state?.returnTo || "/schools";

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const initialSchoolState = {
        name: '',
        email: '',
        phone: '',
        city: '',
        county: '',
        address: '',
        residenceId: 0,
        has101grades: false,
        has102grades: false,
        has103grades: false,
        has104grades: false,

    };
    const [school, setSchool] = useState<School>(initialSchoolState);
    const [residences, setResidences] = useState<TypeResidence[]>([]);


    useEffect(() => {
        const fetchResidences = async () => {
            try {
                const response = await apiClient.get(`/api/types/residences`);
                if (response.status == 200) {
                    const data = response.data.map((residence: TypeResidence) => ({
                        ...residence,
                    }));
                    setResidences(data);
                }
                else {
                    setError(response?.data?.message || 'An error occurred.');
                }
            } catch (error) {
                setError(`An error occurred. ${error}`);
            }
        };

        fetchResidences();
    }, [])

    useEffect(() => {
        const fetchSchool = async () => {
            if (schoolId) {
                setLoading(true);
                try {
                    const response = await apiClient.get(`/api/schools/${schoolId}`);

                    if (response.status === 200) {
                        const schoolData = response.data;
                        setSchool(schoolData);
                    } else {
                        setError(response?.data?.message || 'An error occurred.');
                    }
                } catch (error: any) {
                    setError(`Error fetching school: ${error.response?.data?.message || error.message}`);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSchool();
    }, [schoolId]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSchool((prevSchool) => ({ ...prevSchool, [e.target.name]: e.target.value, }));
    };


    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSchool((prevSchool) => ({ ...prevSchool, [e.target.name]: e.target.value, }));
    };


    // Handle checkbox change
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setSchool((prevSchool) => ({
            ...prevSchool,
            [name]: checked,  // Update the checkbox value (true/false)
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const request = schoolId
                ? apiClient.put(`/api/schools/${schoolId}`, school)
                : apiClient.post('/api/schools', school);

            const response = await request;
            if (response.status === 201 || response.status === 200) {
                setSchool(initialSchoolState);
                if (typeof onSchoolAdded === 'function') onSchoolAdded();
                navigate(returnTo);
            }
            else {
                setError(response?.data?.message || 'An error occurred.');
            }
        }
        catch (error: any) {
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


    const handleCancel = () => {
        if (typeof onCancel === 'function') onCancel();
        navigate(returnTo);
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h3 className="text-center my-4">{schoolId ? 'Actualizare' : 'Adăugare'} unitate de învățământ</h3>
                    {error && <Alert key="danger" variant="danger"><i className="bi bi-exclamation-triangle"></i>{' '}{error}</Alert>}
                    <Form onSubmit={handleSubmit}>

                        {loading
                            ? (<LoadingData />)
                            : (
                                <>
                                    <Form.Group controlId="formName" className="mb-3">
                                        <Form.Label>Nume unitate de învățământ</Form.Label>
                                        <Form.Control type="text" name="name" value={school.name} onChange={handleChange} required />
                                    </Form.Group>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId="formEmail" className="mb-3">
                                                <Form.Label>Adresa de e-mail</Form.Label>
                                                <Form.Control type="email" name="email" value={school.email} onChange={handleChange} required />
                                            </Form.Group>

                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formPhone" className="mb-3">
                                                <Form.Label>Telefon</Form.Label>
                                                <Form.Control type="text" name="phone" value={school.phone} onChange={handleChange} required />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group controlId="formAddress" className="mb-3">
                                        <Form.Label>Adresa</Form.Label>
                                        <Form.Control type="text" name="address" value={school.address} onChange={handleChange} required />
                                    </Form.Group>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId="formCity" className="mb-3">
                                                <Form.Label>Oraș</Form.Label>
                                                <Form.Control type="text" name="city" value={school.city} onChange={handleChange} required />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formCounty" className="mb-3">
                                                <Form.Label>Județ</Form.Label>
                                                <Form.Control type="text" name="county" value={school.county} onChange={handleChange} required />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formResidenceType" className="mb-3">
                                                <Form.Label>Tip rezidență</Form.Label>
                                                <Form.Select name='residenceId' value={school.residenceId} onChange={handleSelectChange} required>
                                                    <option value="">Alegeți tipul de rezidență...</option>
                                                    {residences.map((residence) => (
                                                        <option key={residence.id} value={residence.id}>
                                                            {residence.residence}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group controlId="formHasPrimarySchool" className="mb-0">
                                        <Form.Label>Planul de scolarizare al școlii cuprinde următoarele niveluri de studiu:</Form.Label>
                                    </Form.Group>
                                    <Form.Group controlId="formHasPrimarySchool" className="mb-1 ms-4">
                                        <Form.Check type="checkbox" name="has101grades" checked={school.has101grades} onChange={handleCheckboxChange}
                                            label="Învățământul Primar - clasele: pregătitoare + I - IV"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formHasLowerSecondarySchool" className="mb-1 ms-4">
                                        <Form.Check type="checkbox" name="has102grades" checked={school.has102grades} onChange={handleCheckboxChange}
                                            label="Învățământul Gimnazial - clasele: V - VIII"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formHasSecondarySchool" className="mb-1 ms-4">
                                        <Form.Check type="checkbox" name="has103grades" checked={school.has103grades} onChange={handleCheckboxChange}
                                            label="Include Învățământul liceal - clasele: IX - XII"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formHasSecondaryVocationalSchool" className="mb-3 ms-4">
                                        <Form.Check type="checkbox" name="has104grades" checked={school.has104grades} onChange={handleCheckboxChange}
                                            label="Include Învățământul liceal + profesional - clasele: IX - XIII"
                                        />
                                    </Form.Group>



                                </>
                            )}
                        <div className="mb-3 d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={handleCancel}>Renunță</Button>
                            <Button variant="primary" type="submit" className="ms-2">{schoolId ? 'Actualizare' : 'Adăugare'}</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AddSchoolForm;

