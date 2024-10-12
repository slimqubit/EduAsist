
import React from 'react';

import { Container, Row, Col, Button, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiService';


import { useState } from 'react';



interface Product {
    id: number;
    name: string;
    expirationDate: string;
    stock: number;
}




const Dashboard: React.FC = () => {

    const handleDroptables = async () => {
        try {
            const response = await apiClient.get(`/api/utils/drop_tables`);
            console.log(JSON.stringify(response.data))
        } catch (error: any) {
            console.log(`Error fetching school: ${error.response?.data?.message || error.message}`);
        }
    };


    const handleInitialize = async () => {
        try {
            const tdRresponse = await apiClient.get(`/api/utils/initialize_data/add_typedata`);
            console.log(JSON.stringify(tdRresponse.data));

            const sdResponse = await apiClient.get(`/api/utils/initialize_data/add_sampledata`);
            console.log(JSON.stringify(sdResponse.data));
        } catch (error: any) {
            console.log(`Error fetching school: ${error.response?.data?.message || error.message}`);
        }
    };








    return (
        <Container fluid>
            <Row className="my-4">
                <Col>
                    <h2>Tablou de bord</h2>
                </Col>
            </Row>
            <Row>
                <Alert key="secondary" variant="secondary">Momentan această pagină este goală</Alert>
            </Row>
            <Row>
                <div className="mb-3 d-flex justify-content-center">
                    <Link
                        to={{
                            pathname: `/test_page`,
                        }}
                        className="btn btn-primary btn-sm mb-3"
                    >
                        Testing page
                    </Link>
                </div>
            </Row>
            <Row>
                <div className="mb-3 d-flex justify-content-center">
                    <Button className="me-2" variant="primary" type="submit" onClick={handleDroptables}>Drop Tables</Button>
                    <Button className="ms-2" variant="primary" type="submit" onClick={handleInitialize}>Initialize </Button>
                </div>

            </Row>
        </Container>
    );
};

export default Dashboard;
