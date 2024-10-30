import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Table } from 'react-bootstrap';
import { useLocation, useParams, Link } from 'react-router-dom';
import { LoadingData } from '../components/cmpUtils';


import { apiClient } from "../services/apiService";
import { storageService } from "../services/storageService";

import useConfirmDeleteDialog from '../components/dlgDeleteConfirmation';
import ClassSelector from '../components/Selector_Class';

import { Class, Student } from '../types/types';


const StudentList: React.FC = () => {

    const { schoolId } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialClassId = queryParams.get('classId');
    const [classId, setClassId] = useState<number | null>(initialClassId ? parseInt(initialClassId, 10) : null);


    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const { confirmDelete, ConfirmDeleteDialogComponent } = useConfirmDeleteDialog();

    const [returnToState, setReturnToState] = useState<string>(classId ? `${location.pathname}?classId=${classId}` : `${location.pathname}`);


    const formatDateForDisplay = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };



    const handleClassChange = (classId: number | null) => {
        setClassId(classId);
        if (classId && classId !== 0) {
            storageService.setSelectedClass(classId);
            setReturnToState(`${location.pathname}?classId=${classId}`);
        } else {
            storageService.removeSelectedClass()
            setReturnToState(`${location.pathname}`);
        }
    };


    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirmDelete(`Urmeaza să ștergeți elevul: "${name}"\n\nȘtergerea datelor este ireversibilă. Doriți să continuați?`);
        if (confirmed) {
            apiClient.delete(`/api/schools/${schoolId}/students/${id}`)
                .then(() => setStudents(students.filter(student => student.id !== id)))
                .catch(error => console.error('Error deleting student:', error));
        }
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

        fetchClasses();
    }, []);

    // Update student list on render and on classId change
    useEffect(() => {
        const fetchStudents = async () => {
            if (schoolId) {
                try {
                    setLoading(true);
                    const request = (classId === 111)
                        ? apiClient.get(`/api/schools/${schoolId}/students/inschool`)
                        : apiClient.get(`/api/schools/${schoolId}/students/inclass/${classId}`);

                    const response = await request;
                    if (response.status == 200) {
                        const classesData = response.data.map((student: Student) => ({
                            ...student,
                        }));
                        setStudents(classesData);
                    }
                    else {
                        setError(response?.data?.message || 'An error occurred.');
                        setStudents([]);
                    }
                } catch (error) {
                    setError(`An error occurred. ${error}`);
                    setStudents([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        setError(null);
        fetchStudents();
    }, [classId]);



    return (

        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h3 className="my-4">Lista elevilor pe clase</h3>

                    {error && <Alert key="danger" variant="danger">{error}</Alert>}

                    <Row className='mb-4'>
                        {/* Class Selector */}
                        <ClassSelector
                            initialClassId={classId}
                            classes={classes}
                            enableAll={true}
                            enableGroup={false}
                            onSelectionChange={handleClassChange}

                        />
                    </Row>

                    {loading
                        ? (<LoadingData />)
                        : (
                            <>
                                {students.length > 0 ?
                                    (
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Numele și Prenumele elevului</th>
                                                    <th>CNP</th>
                                                    <th>Data nașterii</th>
                                                    <th className="actions-center">Acțiuni</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map((student) => (
                                                    <tr key={student.id}>
                                                        <td>{student.lastName} {student.firstName} </td>
                                                        <td>{student.cnp}</td>
                                                        <td>{formatDateForDisplay(student.dateOfBirth)}</td>
                                                        <td className="actions-end">
                                                            <Link
                                                                to={{
                                                                    pathname: `/schools/${student.schoolId}/classes/${student.classId}/students/edit/${student.id}`,
                                                                }}
                                                                state={{ returnTo: `${returnToState}` }} // State Object
                                                                className="btn btn-warning btn-sm me-2"
                                                            >
                                                                <i className="bi bi-pencil-square"></i>
                                                            </Link>

                                                            <Link
                                                                to={{
                                                                    pathname: `/schools/${student.schoolId}/classes/${student.classId}/students/${student.id}/medicalrecord`,
                                                                }}
                                                                state={{ returnTo: `${returnToState}` }} // State Object
                                                                className="btn btn-warning btn-sm me-2"
                                                            >
                                                                <i className="bi bi-info-circle"></i>
                                                            </Link>
                                                            <button onClick={() => {
                                                                if (student.id !== undefined) {
                                                                    handleDelete(student.id, `${student.lastName} ${student.firstName}`);
                                                                }
                                                            }}
                                                                className="btn btn-danger btn-sm">
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>

                                    ) : (
                                        <Alert key="secondary" variant="secondary" className="my-4">
                                            <i className="bi bi-info-circle me-2"></i>
                                            Nu au fost introduși elevi pentru clasa selectată.
                                        </Alert>
                                    )
                                }
                            </>
                        )}
                    <div className="mb-3 d-flex justify-content-end">
                        <Link
                            to={{
                                pathname: `/schools/${schoolId}/classes/students/add`,
                                search: `?classId=${classId}`,
                            }}
                            state={{ returnTo: `${returnToState}` }} // State Object
                            className="btn btn-primary btn-sm mb-3">Adaugă un elev nou</Link>
                    </div>
                    {ConfirmDeleteDialogComponent}

                </Col>
            </Row>
        </Container>
    );
};

export default StudentList;
