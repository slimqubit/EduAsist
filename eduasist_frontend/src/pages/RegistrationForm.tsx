// src/pages/Register.tsx


import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiService';

const RegistrationForm: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            const response = await apiClient.post('/api/auth/register', { firstName, lastName, email, password });

            if (response.status === 201) {
                navigate('/login');
            } else {
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


    const handleCancel = () => {
        navigate('/');
    };


    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center my-4">Înregistrare utilizator</h2>
                    {error && <Alert key="danger" variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group controlId="formFirstName" className="mb-3">
                                    <Form.Label>Prenume</Form.Label>
                                    <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /*placeholder="Enter first name"*/ />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formLastName" className="mb-3">
                                    <Form.Label>Nume</Form.Label>
                                    <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required /*placeholder="Enter last name"*/ />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label>Adresa de e-mail</Form.Label>
                                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /*placeholder="Enter email"*/ />
                                </Form.Group>
                            </Col>
                            <Col>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Parola</Form.Label>
                                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /*placeholder="Password"*/ />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formConfirmPassword" className="mb-3">
                                    <Form.Label>Confirmă Parola</Form.Label>
                                    <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /*placeholder="Confirm password"*/ />
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row className="mb-3 justify-content-center">
                            <Col xs="auto">
                                <Form.Text id="emailHelp" >Ai deja un cont? Te poti autentifica <a href="/login">aici</a>.</Form.Text>
                            </Col>
                        </Row>
                        <div className="mb-3 d-flex justify-content-center">
                        <Button variant="secondary" onClick={handleCancel} className="me-2">Renunță</Button>
                        <Button variant="primary" type="submit" className="ms-2" >Înregistrare</Button>{'  '}
                        </div>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default RegistrationForm;
