// src/components/AddSomatoMMForm.tsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Table } from 'react-bootstrap';
import { LoadingData } from '../components/cmpUtils';

import { apiClient } from '../services/apiService';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { StudentInfo } from '../components/cmpStudent';

import { SomatoMM, Student, OmsIndexMeasurement } from '../types/types';

import { calculateAgeInYears, calculateAgeInMonths, calculateIMC, getOmsIndex, getOmsPlacement } from '../components/cmpUtils';


const initialStudentState: Student = {
    firstName: '',
    lastName: '',
    cnp: '',
    dateOfBirth: '',
    residenceId: 0,
    genderId: 0,
    address: ''
}

const initialSomatoMMState: SomatoMM = {
    weight: 0.00,
    height: 0.00,
    chestCircumference: 0.00,
    headCircumference: 0.00,
    measurementDate: new Date().toISOString().split('T')[0],
    studentId: 0,
    omsAge: 0,
    ageMonths: 0,
    resImc: 0,
    resHeight: 0,
    resWeight: 0,
    resCCest: 0,
    resCHead: 0,
};


interface AddSomatoMMFormProps {
    onSomatoMMAdded?: () => void;
    onCancel?: () => void;
}


const AddSomatoMMForm: React.FC<AddSomatoMMFormProps> = ({ onSomatoMMAdded, onCancel }) => {

    const { schoolId: initialSchoolId } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   
    const schoolId = Number(initialSchoolId); // or parseInt(schoolId, 10)


    const [student, setStudent] = useState<Student>(initialStudentState);

    const { somatommId, studentId } = useParams<{ somatommId?: string; studentId: string }>();  // Get the id and studentId from the path                   




    const location = useLocation();
    const navigate = useNavigate();
    const returnTo = location.state?.returnTo || `/schools/${schoolId}/classes/students/medicalrecord`;

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const [somatoMM, setSomatoMM] = useState<SomatoMM>(initialSomatoMMState);
    useEffect(() => {
        if (studentId) {
            const parsedId = parseInt(studentId, 10); // Convert to number
            setSomatoMM(prevState => ({
                ...prevState,
                studentId: parsedId,  // Update somatoMM with studentId
            }));
        }
    }, [studentId]);



    useEffect(() => {

    }, []);


    useEffect(() => {
        const fetchSomatoMM = async () => {
            if (somatommId) {
                setLoading(true);
                try {
                    const response = await apiClient.get(`/api/somatomm/${studentId}/${somatommId}`);

                    if (response.status === 200) {
                        const somatoMMData = response.data;
                        if (somatoMMData) { // Assuming `studentData` is the data fetched from the backend
                            setSomatoMM({
                                ...somatoMMData,
                                //measurementDate: formatDateForInput(somatoMMData.measurementDate), // Format for input
                            });
                        }

                        //setStudent(studentData);
                    } else {
                        setError(response?.data?.message || 'An error occurred.');
                    }
                } catch (error: any) {
                    setError(`Error fetching student: ${error.response?.data?.message || error.message}`);
                } finally {
                    setLoading(false);
                }
            }
        };

        const fetchStudent = async () => {
            if (studentId) {
                setLoading(true);
                try {
                    const response = await apiClient.get(`/api/schools/${schoolId}/students/${studentId}`);
                    if (response.status === 200) {
                        const studentData = response.data;
                        if (studentData) { // Assuming `studentData` is the data fetched from the backend
                            setStudent({ ...studentData, });
                        }

                        //setStudent(studentData);
                    } else {
                        setError(response?.data?.message || 'An error occurred.');
                    }
                } catch (error: any) {
                    setError(`Error fetching student: ${error.response?.data?.message || error.message}`);
                } finally {
                    setLoading(false);
                }
            };
        };


        fetchSomatoMM();
        fetchStudent();
    }, [somatommId]);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSomatoMM({
            ...somatoMM,
            [name]: name === 'measurementDate' ? value : parseFloat(value),
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentId) {
            alert('Please select a school first.');
            return;
        }

        try {

            const ageMonths = calculateAgeInMonths(new Date(student.dateOfBirth), new Date(somatoMM.measurementDate));
            let omsIndex = [];

            try {
                const response = await apiClient.get(`/api/types/omsindexmeasurements/byage/${student.residenceId}/${student.genderId}/${ageMonths}`);
                if (response.status === 200) {
                    const data = response.data.map((omsIndexMeasurement: OmsIndexMeasurement) => ({
                        ...omsIndexMeasurement,
                    }));
                    omsIndex = data;
                } else {
                    setError(response?.data?.message || 'An error occurred.');
                }
            } catch (error: any) {
                setError(`Error fetching student: ${error.response?.data?.message || error.message}`);
            }

            // Create a new somatoMM object with the updated values
            const updatedSomatoMM = {
                ...somatoMM,
                omsAge: calculateAgeInYears(new Date(student.dateOfBirth), new Date(somatoMM.measurementDate)),
                ageMonths: calculateAgeInMonths(new Date(student.dateOfBirth), new Date(somatoMM.measurementDate)),
                resImc: calculateIMC(somatoMM.weight, somatoMM.height),

                // 1: Greutate, 2: Înălțime, 3: Circ.Craniana, 4: Perim.Toracic
                resWeight: getOmsIndex(somatoMM.weight, 1, omsIndex),
                resHeight: getOmsIndex(somatoMM.height, 2, omsIndex),
                resCHead: getOmsIndex(somatoMM.headCircumference, 3, omsIndex),
                resCCest: getOmsIndex(somatoMM.chestCircumference, 4, omsIndex),
            };

            //           alert(`studentId: ${studentId}    soomId: ${id}`);


            //alert(schoolId);
            const request = somatommId
                ? apiClient.put(`/api/somatomm/${studentId}/${somatommId}`, updatedSomatoMM)
                : apiClient.post(`/api/somatomm/${studentId}/`, updatedSomatoMM);

            const response = await request;
            if (response.status === 201 || response.status === 200) {
                setSomatoMM(initialSomatoMMState);
                if (typeof onSomatoMMAdded === 'function') onSomatoMMAdded();
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
                <Col xs={12} md={12}>
                    <h3 className="text-center my-4">{somatommId ? 'Actualizare' : 'Adăugare'} măsurătoare somato metrică</h3>
                    {error && <Alert key="danger" variant="danger">{error}</Alert>}

                    <StudentInfo loading={loading} student={student} />

                    <Form onSubmit={handleSubmit} className="mb-3 mt-5">
                        {loading
                            ? (<LoadingData />)
                            : (
                                <>
                                    <h4 className="fw-light">Editare măsurători</h4>
                                    <hr className="border-top border-primary my-1 opacity-25" />

                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="formMeasurementDate" className="mb-3">
                                                <Form.Label>Data măsurătorii</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="measurementDate"
                                                    value={somatoMM.measurementDate}
                                                    onChange={handleChange}
                                                    placeholder="Select date"
                                                    isInvalid={!somatoMM.measurementDate}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select a valid measurement date.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formHeight" className="mb-3">
                                                <Form.Label>Înălțime [cm]</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="height"
                                                    step="0.01"
                                                    min="0"
                                                    value={somatoMM.height}
                                                    onChange={handleChange}
                                                    placeholder="Enter height"
                                                    isInvalid={somatoMM.height < 0}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid height.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formWeight" className="mb-3">
                                                <Form.Label>Greutate [kg]</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="weight"
                                                    step="0.01"
                                                    min="0"
                                                    value={somatoMM.weight}
                                                    onChange={handleChange}
                                                    placeholder="Enter weight"
                                                    isInvalid={somatoMM.weight < 0}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid weight.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formChestCircumference" className="mb-3">
                                                <Form.Label>Circumferința pieptului [cm]</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="chestCircumference"
                                                    step="0.01"
                                                    min="0"
                                                    value={somatoMM.chestCircumference}
                                                    onChange={handleChange}
                                                    placeholder="Enter chest circumference"
                                                    isInvalid={somatoMM.chestCircumference < 0}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid chest circumference.
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formHeadCircumference" className="mb-3">
                                                <Form.Label>Circumferința capului [cm]</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="headCircumference"
                                                    step="0.01"
                                                    min="0"
                                                    value={somatoMM.headCircumference}
                                                    onChange={handleChange}
                                                    placeholder="Enter head circumference"
                                                    isInvalid={somatoMM.headCircumference < 0}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid head circumference.
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                        </Col>
                                    </Row>
                                </>
                            )}

                        <div className="mb-3 d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={handleCancel}>Renunță</Button>
                            <Button variant="primary" type="submit" disabled={!studentId} className="ms-2">{somatommId ? 'Actualizare' : 'Adăugare'}</Button>
                        </div>
                    </Form>

                    <Form className="mb-3">
                        {loading
                            ? (<></>)
                            : (
                                <>
                                    <h4 className="fw-light">Rezultate măsurători</h4>
                                    <hr className="border-top border-primary my-1 opacity-25" />

                                    <Row className="my-3">
                                        <Col>

                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>Indice masă<br />corporală</th>
                                                        <th style={{ textAlign: 'center' }}>Rezultat<br />Înălțime</th>
                                                        <th style={{ textAlign: 'center' }}>Rezultat<br />Greutate</th>
                                                        <th style={{ textAlign: 'center' }}>Rezultat<br />Circ. Cap</th>
                                                        <th style={{ textAlign: 'center' }}>Rezultat<br />Circ. Piept</th>
                                                        <th style={{ textAlign: 'center' }}>Interpretare<br />IMC & Înălțime</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{somatoMM.resImc}</td>
                                                        <td style={{ textAlign: 'center' }}>i{somatoMM.resHeight}</td>
                                                        <td style={{ textAlign: 'center' }}>g{somatoMM.resWeight}</td>
                                                        <td style={{ textAlign: 'center' }}>c{somatoMM.resCHead}</td>
                                                        <td style={{ textAlign: 'center' }}>p{somatoMM.resCHead}</td>
                                                        <td style={{ textAlign: 'center' }}><strong>{somatoMM.resHeight && somatoMM.resWeight
                                                            ? (getOmsPlacement(somatoMM.resHeight, somatoMM.resWeight)) : (<></>)}</strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </>
                            )}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};


export default AddSomatoMMForm;
