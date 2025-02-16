// src/pages/Login.tsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiService';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    //const location = useLocation();

    //useEffect(() => {
    //    if (location.state && location.state.message) {
    //        setError(location.state.message);
    //    }
    //}, [location.state]);


    useEffect(() => {
        //        const params = new URLSearchParams(window.location.search);
        //        const message = params.get('message');
        //        if (message) {
        //          setError(message);
        //        }
        if (id && (id === "401")) {
            setError("Sesiunea a expirat. Este necesar să vă autentificați din nou.");
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setError(null);
            const response = await apiClient.post('/api/auth/login', { email, password });

            if (response.status === 200) {
                login(response.data.token, response.data.username);
                navigate('/');
            } else {
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


    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={4}>
                    <h2 className="text-center my-4">Autentificare</h2>
                    {error && <Alert key="danger" variant="danger">{error}</Alert>}
                    <h1>Vite is running in %MODE%</h1>
                    <p>Using data from %VITE_API_URL%</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Adresa de e-mail</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /*placeholder="Enter email"*/ />
                            <Form.Text id="emailHelp" >Nu vom împărtăși adresa ta de e-mail cu altcineva.</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mb-3">
                            <Form.Label>Parola</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /*placeholder="Password"*/ />
                        </Form.Group>
                        <div className="mb-3 d-flex justify-content-center">
                            <Button variant="primary" type="submit" >Autentificare</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;

