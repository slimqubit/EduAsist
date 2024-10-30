// StudentInfo.js
import React, { useState } from 'react';
import { Col, Row, Form, ListGroup, Badge, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDateIsoToRomanian, LoadingData } from './cmpUtils';
import { Student } from '../types/types';




interface StudentInfoProps {
    loading: boolean;
    student: Student;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ loading, student }) => {
    return (
        <div>
            <h4 className="fw-light">Elev <span className="fw-medium">{student.lastName} {student.firstName}</span></h4>
            <hr className="border-top border-primary my-1 opacity-25" />

            <Form className="my-3">
                {loading ? (
                    <LoadingData />
                ) : (
                    <Table>
                        <tbody>
                            <tr style={{ borderStyle: 'none' }}>
                                <td style={{ padding: '0', borderStyle: 'none' }}>CNP: <strong>{student.cnp}</strong></td>
                                <td style={{ padding: '0', borderStyle: 'none' }}>Data nașterii: <strong>{formatDateIsoToRomanian(student.dateOfBirth)}</strong></td>
                                <td style={{ padding: '0', borderStyle: 'none' }}>Sex: <strong>{student.type_gender?.gender}</strong></td>
                                <td style={{ padding: '0', borderStyle: 'none', textAlign: 'center' }}>Clasa: <strong>{student.class?.name}</strong></td>
                                <td style={{ padding: '0', borderStyle: 'none', textAlign: 'right' }}>Diriginte: <strong>{student.class?.class_master}</strong></td>
                            </tr>
                        </tbody>
                    </Table>
                )}
            </Form>
        </div>
    );
};



interface EditStudentButtonProps {
    student: Student;
}

const EditStudentButton: React.FC<EditStudentButtonProps> = ({ student }) => {
    return (
        <div className="mb-3 d-flex justify-content-end">
            <Link
                to={{
                    pathname: `/schools/${student.schoolId}/classes/${student.classId}/students/edit/${student.id}`,
                }}
                state={{ returnTo: `/student_info/${student.id}` }} // State Object
                className="btn btn-primary btn-sm mb-3"
            >
                Editează datele elevului
            </Link>
        </div>

    )
};





interface StudentSelectorProps {
    students: Student[];
    onStudentSelect: (student: Student) => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({ students, onStudentSelect }) => {
    const [query, setQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value) {
            const filtered = students.filter((student) => {
                const fullName = `${student.lastName} ${student.firstName}`.toLowerCase();
                return fullName.includes(value);
            });
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents([]);
        }
    };

    const handleStudentClick = (student: Student) => {
        setQuery(`${student.lastName} ${student.firstName}`);
        setFilteredStudents([]);
        onStudentSelect(student);
    };

    return (
        <div className="dropdown-container">
            <Form.Control
                type="text"
                placeholder="Caută elev aici"
                value={query}
                onChange={handleInputChange}
            />
            {filteredStudents.length > 0 && (
                <ListGroup className="dropdown-list">
                    {filteredStudents.map((student) => (
                        <ListGroup.Item
                            key={student.id}
                            onClick={() => handleStudentClick(student)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{student.lastName} {student.firstName}</strong>
                                    <div className="text-muted"><small>Expiră în: {student.class?.name}</small></div>
                                </div>
                                <Badge bg="secondary">{student.cnp}</Badge>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};



interface UserInfoProps {
    fullName: string;
    address: string;
    dateOfBirth: string;
    age: number;
    email: string;
}

const UserInfoCard: React.FC<UserInfoProps> = ({ fullName, address, dateOfBirth, age, email }) => {
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Card.Title className="text-center">{fullName}</Card.Title>
                <Row>
                    <Col md={6}>
                        <Card.Text><strong>Date of Birth:</strong> {dateOfBirth}</Card.Text>
                        <Card.Text><strong>Age:</strong> {age} years</Card.Text>
                    </Col>
                    <Col md={6}>
                        <Card.Text><strong>Email:</strong> {email}</Card.Text>
                        <Card.Text><strong>Address:</strong> {address}</Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default UserInfoCard;




export { StudentInfo, EditStudentButton, StudentSelector, UserInfoCard };
