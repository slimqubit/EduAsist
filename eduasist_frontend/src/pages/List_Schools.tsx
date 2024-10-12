// src/pages/SchoolList.tsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/apiService';
import { Container, Row, Col, Table, Alert } from 'react-bootstrap';
import { LoadingData } from '../components/cmpUtils';

import { storageService } from '../services/storageService';
import useConfirmDeleteDialog from '../components/dlgDeleteConfirmation';

import { School } from '../types/types';



const SchoolList = () => {

    const { schoolId } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [schools, setSchools] = useState<School[]>([]);
    const { confirmDelete, ConfirmDeleteDialogComponent } = useConfirmDeleteDialog();


    
    useEffect(() => {
        const fetchSchools = async () => {

            try {
                setLoading(true);
                const response = await apiClient.get(`/api/schools`);
                if (response.status == 200) {
                    const schoolsData = response.data.map((school: School) => ({
                        ...school,
                    }));
                    setSchools(schoolsData);
                }
                else {
                    setError(response?.data?.message || 'An error occurred.');
                    setSchools([]);
                }
            } catch (error) {
                setError(`An error occurred. ${error}`);
                setSchools([]);
            } finally {
                setLoading(false);
            }
        }

        fetchSchools();
    }, []);



    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirmDelete(`Urmeaza să ștergeți următoarea unitate de învățământ:\n"${name}"\n\nȘtergerea datelor este ireversibilă. Doriți să continuați?`);
        if (confirmed) {
            try {
                await apiClient.delete(`/api/schools/${id}`);
                setSchools(schools.filter(school => school.id !== id));
                if (schoolId === id) { storageService.removeSelectedSchool(); }
            } catch (error) {
                setError(`An error occurred. ${error}`);
            }
        }
    };


    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h3 className="my-4">Lista unităților de învățământ</h3>

                    {error && <Alert key="danger" variant="danger">{error}</Alert>}

                    {loading
                        ? (<LoadingData />)
                        : (
                            <>
                                {schools.length > 0 ?
                                    (
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Numele unității de învățământ</th>
                                                    <th>Oraș</th>
                                                    <th className="actions-center">Acțiuni</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {schools.map((school) => (
                                                    <tr key={school.id}>
                                                        <td>{school.name}</td>
                                                        <td>{school.city}</td>
                                                        <td className="actions-end">
                                                            <Link to={`/schools/${school.id}/edit`} className="btn btn-warning btn-sm me-2"><i className="bi bi-pencil-square"></i></Link>
                                                            <Link to={`/schools/${school.id}/info`} className="btn btn-warning btn-sm me-2"><i className="bi bi-info-circle"></i></Link>
                                                            <button onClick={() => {
                                                                if (school.id !== undefined) {
                                                                    handleDelete(school.id, school.name);
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
                                            Nu au fost introduse unități de învățământ.
                                        </Alert>
                                    )
                                }
                            </>
                        )}

                    <div className="mb-3 d-flex justify-content-end">
                        <Link to="/schools/add" className="btn btn-primary btn-sm mb-3">Adaugă o școală nouă</Link>
                    </div>

                    {ConfirmDeleteDialogComponent}

                </Col>
            </Row>
        </Container>
    );
};

export default SchoolList;
