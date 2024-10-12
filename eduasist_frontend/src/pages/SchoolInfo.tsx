import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Container, Row, Col } from 'react-bootstrap';

import { apiClient } from '../services/apiService';

import { School, Class } from '../types/types';





const SchoolInfo = () => {
    const { schoolId } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   

    const [school, setSchool] = useState<School>({
        name: '',
        email: '',
        phone: '',
        city: '',
        county: '',
        address: '',
        residenceId: 0,
    });



    //const [school, setSchool] = useState<School | null>(null);
    const [classes, setClasses] = useState<Class[]>([]);



    useEffect(() => {
        if (schoolId) {
            apiClient.get(`/api/schools/${schoolId}`)
                .then(response => {
                    const schoolData = response.data;
                    setSchool(schoolData);
                })
                .catch(error => console.error('Error fetching school:', error));

            apiClient.get(`/api/schools/${schoolId}/classes`)
                .then(response => {
                    const classesData = response.data;
                    setClasses(classesData);
                })
                .catch(error => console.error('Error fetching school:', error));
        }
    }, [schoolId]);

    if (!school) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col md={8} className="offset-md-2">
                    <Card>
                        <Card.Header as="h5">School Information</Card.Header>
                        <Card.Body>
                            <Card.Title>{school.name}</Card.Title>
                            <Card.Text><strong>Email:</strong> {school.email}</Card.Text>
                            <Card.Text><strong>Phone:</strong> {school.phone}</Card.Text>
                            <Card.Text><strong>City:</strong> {school.city}</Card.Text>
                            <Card.Text><strong>County:</strong> {school.county}</Card.Text>
                            <Card.Text><strong>Address:</strong> {school.address}</Card.Text>
                            <Card.Text><strong>Residence Type:</strong> {school.residenceId}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4">
                        <Card.Header as="h5">Classes</Card.Header>
                        <ListGroup variant="flush">
                            {classes.map(c => (
                                <ListGroup.Item key={c.id}>{c.name}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SchoolInfo;
