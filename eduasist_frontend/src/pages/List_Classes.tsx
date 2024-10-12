// src/components/ClassSelector.tsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/apiService';
import { Container, Row, Col, Table, Alert } from 'react-bootstrap';
import { LoadingData } from '../components/cmpUtils';


import useConfirmDeleteDialog from '../components/dlgDeleteConfirmation';

import { Class } from '../types/types';



const ClassList = () => {

    const { schoolId } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [classes, setClasses] = useState<Class[]>([]);
    const { confirmDelete, ConfirmDeleteDialogComponent } = useConfirmDeleteDialog();



    useEffect(() => {
        const fetchClasses = async () => {
            if (schoolId) {
                try {
                    setLoading(true);
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
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchClasses();
    }, [schoolId]);


    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirmDelete(`Urmeaza să ștergeți clasa: "${name}"\n\nȘtergerea datelor este ireversibilă. Doriți să continuați?`);
        if (confirmed) {
            apiClient.delete(`/api/schools/${schoolId}/classes/${id}`)
                .then(() => setClasses(classes.filter(_class => _class.id !== id)))
                .catch(error => console.error('Error deleting school:', error));
        }
    };


    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h3 className="my-4">Lista claselor</h3>

                    {error && <Alert key="danger" variant="danger">{error}</Alert>}

                    {loading
                        ? (<LoadingData />)
                        : (
                            <>
                                {classes.length > 0 ?
                                    (
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Numele clasei</th>
                                                    <th>Diriginte</th>
                                                    <th>Nivel</th>
                                                    <th className="actions-center">Acțiuni</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {classes.map((_class) => (
                                                    <tr key={_class.id}>
                                                        <td>{_class.name}</td>
                                                        <td>{_class.class_master}</td>
                                                        <td>{_class.grade}</td>
                                                        <td className="actions-end">
                                                            <Link to={`/schools/${schoolId}/classes/${_class.id}/edit`} className="btn btn-warning btn-sm me-2"><i className="bi bi-pencil-square"></i></Link>
                                                            <Link to={`/schools/${schoolId}/classes/${_class.id}/info`} className="btn btn-warning btn-sm me-2"><i className="bi bi-info-circle"></i></Link>
                                                            <button onClick={() => {
                                                                if (_class.id !== undefined && _class.name !== undefined) {
                                                                    handleDelete(_class.id, _class.name);
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
                                            Nu au fost introduse clase în această școală.
                                        </Alert>
                                    )
                                }
                            </>
                        )}

                    <div className="mb-3 d-flex justify-content-end">
                        <Link to={`/schools/${schoolId}/classes/add`} className="btn btn-primary btn-sm mb-3">Adaugă o clasă nouă</Link>
                    </div>

                    {ConfirmDeleteDialogComponent}

                </Col>
            </Row>
        </Container>
    );
};

export default ClassList;
