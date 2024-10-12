// StudentInfo.js
import React, { useState } from 'react';
import { Row, Form, ListGroup, Badge } from 'react-bootstrap';
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
            <h4 className="fw-light">Informații elev</h4>
            <hr className="border-top border-primary my-1 opacity-25" />

            <Form className="my-3">
                {loading ? (
                    <LoadingData />
                ) : (
                    <Row>
                        <dl className="row">
                            <dd className="col-sm-3">Numele și prenumele:</dd>
                            <dt className="col-sm-3 fw-medium">{student.firstName} {student.lastName}</dt>
                            <dd className="col-sm-3">CNP:</dd>
                            <dt className="col-sm-3 fw-medium">{student.cnp}</dt>
                            <dd className="col-sm-3">Clasa:</dd>
                            <dt className="col-sm-3 fw-medium">{student.class?.name}</dt>
                            <dd className="col-sm-3">Data nașterii:</dd>
                            <dt className="col-sm-3 fw-medium">{formatDateIsoToRomanian(student.dateOfBirth)}</dt>
                            <dd className="col-sm-3">Diriginte:</dd>
                            <dt className="col-sm-3 fw-medium">{student.class?.class_master}</dt>
                            <dd className="col-sm-3">Sexul:</dd>
                            <dt className="col-sm-3 fw-medium">{student.type_gender?.gender}</dt>
                        </dl>
                    </Row>
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







export { StudentInfo, EditStudentButton, StudentSelector };
