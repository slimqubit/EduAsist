// src/components/AddStudentForm.tsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { LoadingData } from '../components/cmpUtils';

import { apiClient } from '../services/apiService';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ClassSelector from '../components/Selector_Class';

import { Class, Student, TypeGender } from '../types/types';


interface AddStudentFormProps {
    onStudentAdded?: () => void;
    onCancel?: () => void;
}


const AddStudentForm: React.FC<AddStudentFormProps> = ({ onStudentAdded, onCancel }) => {

    const { schoolId: initialSchoolId  } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   
    const schoolId = Number(initialSchoolId); // or parseInt(schoolId, 10)

    const { classId: paramClassId } = useParams<{ classId: string }>();

    const { studentId } = useParams<{ studentId: string }>();


    const navigate = useNavigate();

    const location = useLocation();
    const returnTo = location.state?.returnTo || `/schools/${schoolId}/classes/students`;
    const queryParams = new URLSearchParams(location.search);
    const initialClassId = queryParams.get('classId');
    const [classId, setClassId] = useState<number | null>(initialClassId ? parseInt(initialClassId, 10) : Number(paramClassId));


    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const initialStudentState = {
        firstName: '',
        lastName: '',
        cnp: '',
        dateOfBirth: '',
        genderId: 0,
        address: ''
    }
    const [student, setStudent] = useState<Student>(initialStudentState);
    const [classes, setClasses] = useState<Class[]>([]);
    const [genders, setGenders] = useState<TypeGender[]>([]);


    const formatDateForInput = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Update classes list just on render
    useEffect(() => {
        setError(null);
        const fetchClasses = async () => {
            if (schoolId) {
                try {                
                    const response = await apiClient.get(`/api/schools/${schoolId}/classes`);
                    if (response.status == 200) {
                        const classesData = response.data.map((_class: Class) => ({
                            ..._class,
                        }));
                        setClasses(classesData);
                    }
                    else {
                        setError(response?.data?.message || 'An error occurred.');
                        setClasses([]);
                    }
                } catch (error) {
                    setError(`An error occurred. ${error}`);
                    setClasses([]);
                }
            }
        };

        const fetchGenders = async () => {
            try {
                const response = await apiClient.get(`/api/types/genders`);
                if (response.status == 200) {
                    const data = response.data.map((gender: TypeGender) => ({
                        ...gender,
                    }));
                    setGenders(data);
                }
                else {
                    setError(response?.data?.message || 'An error occurred.');
                }
            } catch (error) {
                setError(`An error occurred. ${error}`);
            }
        };


        fetchClasses();
        fetchGenders();
    }, []);


    useEffect(() => {
        const fetchStudent = async () => {
            if (studentId) {
                setLoading(true);
                try {
                    const response = await apiClient.get(`/api/schools/${schoolId}/students/${studentId}`);

                    if (response.status === 200) {
                        const studentData = response.data;
                        if (studentData) { // Assuming `studentData` is the data fetched from the backend
                            setStudent({
                                ...studentData,
                                dateOfBirth: formatDateForInput(studentData.dateOfBirth), // Format for input
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

        fetchStudent();
    }, [studentId]);





    //    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //        setClassState({ ...classState, [e.target.name]: e.target.value });
    //    };

    //    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //        setClassState({ ...classState, [e.target.name]: e.target.value });
    //    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStudent(prevState => ({ ...prevState, [name]: value }));
    };

    const handleClassChange = (classId: number | null) => {
        setClassId(classId);
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStudent(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!schoolId) {
            alert('Please select a school first.');
            return;
        }

        if (!classId) {
            alert('Please select a class first.');
            return;
        }

        try {

            setStudent({
                ...student,
                dateOfBirth: formatDateForInput(student.dateOfBirth), // Format for input
                schoolId: schoolId,
                classId: classId,
            });

            //alert(schoolId);
            const request = studentId
                ? apiClient.put(`/api/schools/${schoolId}/students/${studentId}`, student)
                : apiClient.post(`/api/schools/${schoolId}/students`, student);

            const response = await request;
            if (response.status === 201 || response.status === 200) {
                setStudent(initialStudentState);
                if (typeof onStudentAdded === 'function') onStudentAdded();
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
                    <h3 className="text-center my-4">{studentId ? 'Actualizare' : 'Adăugare'} elev</h3>
                    {error && <Alert key="danger" variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit} className="mb-3">
                        {loading
                            ? (<LoadingData />)
                            : (
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="lastName" className="mb-3">
                                                <Form.Label>Nume elev</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={student.lastName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="firstName">
                                                <Form.Label>Prenume elev</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={student.firstName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId="cnp" className="mb-3">
                                                <Form.Label>CNP</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="cnp"
                                                    value={student.cnp}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="dateOfBirth" className="mb-3">
                                                <Form.Label>Data nașterii</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={student.dateOfBirth}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="dd.MM.yyyy"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="genderTypeSelector">
                                                <Form.Label>Alegeți genul</Form.Label>
                                                <Form.Select name="genderId" value={student.genderId} onChange={handleGenderChange} required>
                                                    <option value="">Alegeți genul...</option>
                                                    {genders.map((gender) => (
                                                        <option key={gender.id} value={gender.id}>
                                                            {gender.gender}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <ClassSelector
                                                initialClassId={classId}
                                                classes={classes}
                                                enableAll={false}
                                                onSelectionChange={handleClassChange}
                                            />
                                        </Col>
                                    </Row>

                                    <Form.Group controlId="address" className="mb-3">
                                        <Form.Label>Adresa</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={student.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </>
                            )}

                        <div className="mb-3 d-flex justify-content-end">
                        <Button variant="secondary" className="me-2" onClick={handleCancel}>Renunță</Button>
                        <Button variant="primary" type="submit" disabled={!schoolId} className="ms-2">{studentId ? 'Actualizare' : 'Adăugare'}</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};


export default AddStudentForm;
