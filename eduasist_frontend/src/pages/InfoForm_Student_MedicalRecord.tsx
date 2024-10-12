import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LoadingData } from '../components/cmpUtils';

import { apiClient } from '../services/apiService';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { StudentInfo } from '../components/cmpStudent';
import { EditStudentButton } from '../components/cmpStudent';

import useConfirmDeleteDialog from '../components/dlgDeleteConfirmation';
import useGiveMedicineDialog from '../components/dlgGiveMedicine';

import { Student, SomatoMM } from '../types/types';
import { StudentSelector } from '../components/cmpStudent';


const initialStudentState = {
    firstName: '',
    lastName: '',
    cnp: '',
    dateOfBirth: '',
    genderId: 0,
    address: ''
}


const InfoStudentMedicalRecordForm: React.FC = () => {


    const { schoolId: initialSchoolId } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   
    const schoolId = Number(initialSchoolId); // or parseInt(schoolId, 10)
    const { classId: initialClassId } = useParams<{ classId: string }>();
    const { studentId: initialStudentId } = useParams<{ studentId: string }>();
    const [classId, setClassId] = useState<number | null>(initialClassId ? parseInt(initialClassId, 10) : null);
    const [studentId, setStudentId] = useState<string | null>(initialStudentId ? initialStudentId : null);




    const [loading, setLoading] = useState(false);
    const location = useLocation(); // Get state and query parameters
    const navigate = useNavigate();


    const returnToState = useState<string>(location.state ? location.state : {});

    //    const queryParams = new URLSearchParams(location.search);

    //   const initialClassId = queryParams.get('classId');
    //   const initialStudentId = queryParams.get('studentId');


    //    const selectedSchool = storageService.getSelectedSchool();
    //    const schoolId = selectedSchool ? selectedSchool.id : null;
 
    const [students, setStudents] = useState<Student[]>([]);



    const defaultReturnTo = `${location.pathname}?classId=${classId}&studentId=${studentId}`;



    const [error, setError] = useState<string | null>(null);



    const [student, setStudent] = useState<Student>(initialStudentState);
    const [somatoMMs, setSomatoMMs] = useState<SomatoMM[]>([]);


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

    const fetchSomatoMMs = async () => {
        if (studentId) {
            setLoading(true);
            try {
                const response = await apiClient.get(`/api/somatomm/${studentId}`);
                if (response.status == 200) {
                    const data = response.data.map((somatoMM: SomatoMM) => ({
                        ...somatoMM,
                    }));
                    setSomatoMMs(data);
                }
                else {
                    setError(response?.data?.message || 'An error occurred.');
                }
            } catch (error) {
                setError(`An error occurred. ${error}`);
            } finally {
                setLoading(false);
            }
        }
    };


    const fetchStudents = async () => {
        if (schoolId) {
            try {
                setLoading(true);
                const response = await apiClient.get(`/api/schools/${schoolId}/students/inschool`);
                if (response.status == 200) {
                    const data = response.data.map((student: Student) => ({
                        ...student,
                    }));
                    setStudents(data);
                }
                else {
                    setError(response?.data?.message || 'An error occurred.');
                }
            } catch (error) {
                setError(`An error occurred. ${error}`);
            } finally {
                setLoading(false);
            }
        }
    };


    useEffect(() => {
        fetchStudent();
        fetchStudents()
        fetchSomatoMMs();
    }, [studentId]);



    const { confirmDelete, ConfirmDeleteDialogComponent } = useConfirmDeleteDialog();
    const handleSomatoMMDelete = async (id: string, measurementDate: string) => {
        const confirmed = await confirmDelete(`Urmeaza să ștergeți măsurătoarea somatometrică din data "${measurementDate}" ${studentId} - ${id}. Ștergerea datelor este ireversibilă. Doriți să continuați?`);
        if (confirmed) {
            apiClient.delete(`/api/somatomm/${studentId}/${id}`)
                .then(() => setSomatoMMs(somatoMMs.filter(somatoMM => somatoMM.id !== id)))
                .catch(error => console.error('Error deleting school:', error));
        }
    }


    const { confirmGiveMedicine, GiveMedicineDialogComponent } = useGiveMedicineDialog();
    const handleGiveMedicine = async () => {
        const confirmed = await confirmGiveMedicine();
        if (confirmed) {

        }
    };

    const handleStudentSelect = (student: Student) => {
        if (student.classId) setClassId(student.classId);
        if (student.id) setStudentId(student.id);
        navigate(`/schools/${schoolId}/classes/${student.classId}/students/${student.id}/medicalrecord`);
    };


    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col >
                    <Row>
                        <Col className="col-md-8">
                            <h3 className="my-4">Dosar medical elev</h3>
                        </Col>

                        <Col className="my-4 col-md-4">

                            <StudentSelector
                                students={students}
                                onStudentSelect={handleStudentSelect}
                            />
                        </Col>
                    </Row>
                    {error && <Alert key="danger" variant="danger">{error}</Alert>}

                    {studentId
                        ? (
                            <>
                                <StudentInfo loading={loading} student={student} />
                                <EditStudentButton student={student} />

                                <h4 className="fw-light">Examene clinice</h4>
                                <hr className="border-top border-primary my-1 opacity-25" />
                                <Row className="my-3 ">
                                    {loading
                                        ? (<LoadingData />)
                                        : (
                                            <>
                                                {0 > 0 ?
                                                    (
                                                        <Table>
                                                            
                                                        </Table>

                                                    ) : (
                                                        <Alert key="secondary" variant="secondary" className="my-2">
                                                            <i className="bi bi-info-circle me-2"></i>
                                                            Pentru acest elev nu au fost realizeate examene clinice.
                                                        </Alert>
                                                    )
                                                }
                                            </>
                                        )}
                                </Row>

                                <div className="mb-3 d-flex justify-content-end">
                                    <Link
                                        to={{
                                            pathname: `/students/edit/${student.id}`,
                                            search: `?classId=${student.classId}`,
                                        }}
                                        state={{ returnTo: { returnToState } }} // State Object
                                        className="btn btn-primary btn-sm mb-3"
                                    >
                                        Realizează un nou examen clinic
                                    </Link>
                                    <Button
                                        className="btn btn-primary btn-sm mb-3 ms-2"
                                        onClick={() => handleGiveMedicine()}
                                    >
                                        Administrează un medicament
                                    </Button>
                                </div>



                                <h4 className="fw-light">Măsurători somatometrice</h4>
                                <hr className="border-top border-primary my-1 opacity-25" />
                                <Row className="my-3 ">
                                    {loading
                                        ? (<LoadingData />)
                                        : (
                                            <>
                                                {somatoMMs.length > 0 ?
                                                    (<>
                                                        <Table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Data<br />măsurătorii</th>
                                                                    <th>Vârsta<br />OMS</th>
                                                                    <th>Greutatea</th>
                                                                    <th>Înălțimea</th>
                                                                    <th>Circum.<br />Cap</th>
                                                                    <th>Perime.<br />Piept</th>
                                                                    <th>IMC</th>
                                                                    <th>Rezultat<br />Greutate</th>
                                                                    <th>Rezultat<br />Înălțime</th>
                                                                    <th>Rezultat<br />C. Cap</th>
                                                                    <th>Rezultat<br />P. Pie</th>
                                                                    <th className="actions-center">Acțiuni</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {somatoMMs.map((somatoMM) => (
                                                                    <tr key={somatoMM.id}>
                                                                        <td>{somatoMM.measurementDate}</td>
                                                                        <td>{somatoMM.omsAge}</td>
                                                                        <td>{somatoMM.weight} kg</td>
                                                                        <td>{somatoMM.height} cm</td>
                                                                        <td>{somatoMM.headCircumference} cm</td>
                                                                        <td>{somatoMM.chestCircumference} cm</td>
                                                                        <td>{somatoMM.resImc}</td>
                                                                        <td>h{somatoMM.resWeight}</td>
                                                                        <td>i{somatoMM.resHeight}</td>
                                                                        <td>c{somatoMM.resCHead}</td>
                                                                        <td>p{somatoMM.resCHead}</td>
                                                                        <td className="actions-end">
                                                                            <Link
                                                                                to={{
                                                                                    pathname: `/students/${studentId}/somatomm/edit/${somatoMM.id}`,
                                                                                }}
                                                                                state={{ returnTo: `${defaultReturnTo}` }} // State Object
                                                                                className="btn btn-warning btn-sm me-2"
                                                                            >
                                                                                <i className="bi bi-pencil-square"></i>
                                                                            </Link>
                                                                            <button onClick={() => {
                                                                                if (somatoMM.id !== undefined) {
                                                                                    handleSomatoMMDelete(somatoMM.id, somatoMM.measurementDate);
                                                                                }
                                                                            }}
                                                                                className="btn btn-danger btn-sm me-2">
                                                                                <i className="bi bi-trash"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </>
                                                    ) : (
                                                        <Alert key="secondary" variant="secondary" className="my-2">
                                                            <i className="bi bi-info-circle me-2"></i>
                                                            Pentru acest elev nu au fost realizeate măsurători somatometrice.
                                                        </Alert>
                                                    )
                                                }
                                            </>
                                        )}
                                </Row>

                                <div className="mb-3 d-flex justify-content-end">
                                    <Link
                                        to={{
                                            pathname: `/schools/${schoolId}/classes/${student.classId}/students/${student.id}/somatomm/add`,
                                            //search: `?classId=${student.classId}`,
                                        }}
                                        state={{ returnTo: { returnToState } }} // State Object
                                        className="btn btn-primary btn-sm mb-3"
                                    >
                                        Realizează o nouă măsurătoare
                                    </Link>
                                </div>
                            </>
                        )


                        : (
                            <Row className="mb-4 ">
                            <Alert key="secondary" variant="secondary" className="my-2">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Nu a fost selectat niciun elev. Utilizați zona de căutare pentru a alege un elev.
                            </Alert>
                            </Row>
                        )}



                </Col>
            </Row>

            {ConfirmDeleteDialogComponent}
            {GiveMedicineDialogComponent}

        </Container>
    );
};



export default InfoStudentMedicalRecordForm;