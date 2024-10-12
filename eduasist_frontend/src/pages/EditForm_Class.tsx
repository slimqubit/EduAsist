// src/components/AddClassForm.tsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { LoadingData } from '../components/cmpUtils';
import { apiClient } from '../services/apiService';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { Class } from '../types/types';


interface AddClassFormProps {
    onClassAdded?: () => void;
    onCancel?: () => void;
}


const AddClassForm: React.FC<AddClassFormProps> = ({ onClassAdded, onCancel }) => {

    const { schoolId } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   
    const { classId } = useParams<{ classId: string }>();

    const location = useLocation();
    const navigate = useNavigate();
    const returnTo = location.state?.returnTo || `/schools/${schoolId}/classes`;

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const initialClassState = {
        grade: 0,
        letter: '',
        class_master: ''
    };
    const [classState, setClassState] = useState<Class>(initialClassState);



    useEffect(() => {
        if (schoolId) {
            const parsedId = parseInt(schoolId, 10); // Convert to number
            setClassState(prevState => ({
                ...prevState,
                schoolId: parsedId,  // Update somatoMM with studentId
            }));
        }
    }, [schoolId]);

    useEffect(() => {
        const fetchClass = async () => {
            if (classId) {
                setLoading(true);
                try {
                    const response = await apiClient.get(`/api/schools/${schoolId}/classes/${classId}`);

                    if (response.status === 200) {
                        const classData = response.data;
                        setClassState(classData);
                    } else {
                        setError(response?.data?.message || 'An error occurred.');
                    }
                } catch (error: any) {
                    setError(`Error fetching class: ${error.response?.data?.message || error.message}`);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchClass();
    }, [classId]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = value === '' ? null : (value.length === 1 ? value.toUpperCase() : value);
        setClassState(prevState => ({ ...prevState, [name]: newValue }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setClassState(prevState => ({ ...prevState, [name]: value }));
        setClassState({ ...classState, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!schoolId) {
            alert('Please select a school first.');
            return;
        }

        try {
            const request = classId
                ? apiClient.put(`/api/schools/${schoolId}/classes/${classId}`, classState)
                : apiClient.post(`/api/schools/${schoolId}/classes`, classState);

            const response = await request;
            if (response.status === 201 || response.status === 200) {
                setClassState(initialClassState);
                if (typeof onClassAdded === 'function') onClassAdded();
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
                    <h3 className="text-center my-4">{classId ? 'Actualizare' : 'Adăugare'} clasă</h3>
                    {error && <Alert key="danger" variant="danger"><i className="bi bi-exclamation-triangle"></i>{' '}{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {loading
                            ? (<LoadingData />)
                            : (
                                <>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId="formClassGrade" className="mb-3">
                                                <Form.Label>Nivelul de studii</Form.Label>
                                                <Form.Select name="grade" value={classState.grade} onChange={handleSelectChange} required>
                                                    <option value="">Selectati nivelul</option>
                                                    <option value={5}>a V-a</option>
                                                    <option value={6}>a VI-a</option>
                                                    <option value={7}>a VII-a</option>
                                                    <option value={8}>a VIII-a</option>
                                                    <option value={9}>a IX-a</option>
                                                    <option value={10}>a X-a</option>
                                                    <option value={11}>a XI-a</option>
                                                    <option value={12}>a XII-a</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="classLetter" className="mb-3">
                                                <Form.Label>Litera Clasei</Form.Label>
                                                <Form.Control type="text" name="letter" value={classState.letter} onChange={handleChange} />
                                            </Form.Group>

                                        </Col>
                                    </Row>

                                    <Form.Group controlId="classMaster" className="mb-3">
                                        <Form.Label>Diriginte</Form.Label>
                                        <Form.Control type="text" name="class_master" value={classState.class_master} onChange={handleChange} />
                                    </Form.Group>
                                </>
                            )}

                        <div className="mb-3 d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={handleCancel}>Renunță</Button>
                            <Button variant="primary" type="submit" disabled={!schoolId} className="ms-2">{classId ? 'Actualizare' : 'Adăugare'}</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AddClassForm;
