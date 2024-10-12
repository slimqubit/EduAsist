// src/pages/SchoolForm.tsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { LoadingData } from '../components/cmpUtils';
import { apiClient } from '../services/apiService';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import {School, TypeResidence} from '../types/types';


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
        setSchool({ ...school, [e.target.name]: e.target.value });
    };


    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSchool({ ...school, [e.target.name]: e.target.value });
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
                                            {/*
                                <Form.Group controlId="formResidenceType" className="mb-3">
                                    <Form.Label>Tip rezidență</Form.Label>
                                    <Form.Select name="residenceType" value={school.residenceType} onChange={handleSelectChange} required>
                                        <option value="">Selectati rezidența</option>
                                        <option value="urban">Urban</option>
                                        <option value="rural">Rural</option>
                                    </Form.Select>
                                </Form.Group>
                                        */}
                                        </Col>
                                    </Row>

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

