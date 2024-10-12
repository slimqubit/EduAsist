import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Table, Form } from 'react-bootstrap';
import { LoadingData } from '../components/cmpUtils';


import { apiClient } from "../services/apiService";

import { TypeGender, TypeResidence, TypeMeasurement, OmsIndexMeasurement } from '../types/types';


const OmsIndexesList: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [genders, setGenders] = useState<TypeGender[]>([]);
    const [residences, setResidences] = useState<TypeResidence[]>([]);
    const [measurements, setMeasurements] = useState<TypeMeasurement[]>([]);
    const [indexMeasurements, setIndexMeasurements] = useState<OmsIndexMeasurement[]>([]);

    //const { confirm, ConfirmDialogComponent } = useConfirmDeleteDialog();
    const [error, setError] = useState<string | null>(null);


    const [genderId, setGenderId] = useState<number | null>();
    const [residenceId, setResidenceId] = useState<number | null>();
    const [measurementId, setMeasurementId] = useState<number | null>();

    /*
    
        const handleClassChange = (classId: number | null) => {
            setClassId(classId);
            if (classId && classId !== 0) {
                storageService.setSelectedClass(classId);
            } else {
                storageService.removeSelectedClass()
            }
        };
    
    */

    const handleMeasurementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parsedValue = parseInt(e.target.value, 10);
        const measurementId = isNaN(parsedValue) ? null : parsedValue;
        setMeasurementId(measurementId);
    };


    const handleResidenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parsedValue = parseInt(e.target.value, 10);
        const residenceId = isNaN(parsedValue) ? null : parsedValue;
        setResidenceId(residenceId);
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parsedValue = parseInt(e.target.value, 10);
        const genderId = isNaN(parsedValue) ? null : parsedValue;
        setGenderId(genderId);
    };


    // Update classes list just on render
    useEffect(() => {
        setError(null);
        setLoading(true);

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

        const fetchResidences = async () => {
            try {
                const response = await apiClient.get(`/api/types/residences`);
                if (response.status == 200) {
                    const data = response.data.map((residence: TypeResidence) => ({
                        ...residence,
                    }));
                    setResidences(data);
                }
                else {
                    setError(response?.data?.message || 'An error occurred.');
                }
            } catch (error) {
                setError(`An error occurred. ${error}`);
            }
        };

        const fetchMeasurements = async () => {
            try {
                const response = await apiClient.get(`/api/types/measurements`);
                if (response.status == 200) {
                    const data = response.data.map((measurement: TypeResidence) => ({
                        ...measurement,
                    }));
                    setMeasurements(data);
                }
                else {
                    setError(response?.data?.message || 'An error occurred.');
                }
            } catch (error) {
                setError(`An error occurred. ${error}`);
            }
        };


        fetchGenders();
        fetchResidences();
        fetchMeasurements();
        setLoading(false);
    }, []);


    // Update OMS Measurement Index list on render and on classId change
    useEffect(() => {
        const fetchStudents = async () => {
            if (genderId && residenceId && measurementId) {
                try {
                    setLoading(true);
                    const request = apiClient.get(`/api/types/omsindexmeasurements/${residenceId}/${measurementId}/${genderId}`);

                    const response = await request;
                    if (response.status == 200) {
                        const measurementData = response.data.map((oiMeasurement: OmsIndexMeasurement) => ({
                            ...oiMeasurement,
                        }));
                        setIndexMeasurements(measurementData);
                    }
                    else {
                        setError(response?.data?.message || 'An error occurred.');
                        setIndexMeasurements([]);
                    }
                } catch (error) {
                    setError(`An error occurred. ${error}`);
                    setIndexMeasurements([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        setError(null);
        fetchStudents();
    }, [genderId, residenceId, measurementId]);


    const formatNumber = (num: number) => num.toFixed(2);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h3 className="my-4">Indici de înălțime și greutate, conform referințelor naționale</h3>

                    {error && <Alert key="danger" variant="danger">{error}</Alert>}


                    <Row className='mb-4'>
                        <Col>
                            <Form.Group controlId="measurementTypeSelector">
                                <Form.Label>Alegeți tipul de măsurătoare</Form.Label>
                                <Form.Select as="select" value={measurementId !== null ? measurementId : ''} onChange={handleMeasurementChange} >
                                    <option value="">Alegeți tipul de măsurătoare ...</option>
                                    {measurements.map((measurement) => (
                                        <option key={measurement.id} value={measurement.id}>
                                            {measurement.measurement}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="genderTypeSelector">
                                <Form.Label>Alegeți genul</Form.Label>
                                <Form.Select as="select" value={genderId !== null ? genderId : ''} onChange={handleGenderChange}>
                                    <option value="">Alegeți genul...</option>
                                    {genders.map((gender) => (
                                        <option key={gender.id} value={gender.id}>
                                            {gender.gender_pl}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="residenceTypeSelector">
                                <Form.Label>Alegeți tipul de rezidență</Form.Label>
                                <Form.Select as="select" value={residenceId !== null ? residenceId : ''} onChange={handleResidenceChange} >
                                    <option value="">Alegeți tipul de rezidență...</option>
                                    {residences.map((residence) => (
                                        <option key={residence.id} value={residence.id}>
                                            {residence.residence}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>


                    {loading
                        ? (<LoadingData/>)
                        : (
                            <>
                                {indexMeasurements.length > 0 ?
                                    (

                                        <Table striped hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Vârsta</th>
                                                    <th style={{ textAlign: 'right' }}>Media</th>
                                                    <th style={{ textAlign: 'right' }}>Dev. Std.</th>
                                                    <th style={{ textAlign: 'right' }}>M -3d.s</th>
                                                    <th style={{ textAlign: 'right' }}>M -2d.s</th>
                                                    <th style={{ textAlign: 'right' }}>M -1d.s</th>
                                                    <th style={{ textAlign: 'right' }}>M +1d.s</th>
                                                    <th style={{ textAlign: 'right' }}>M +2d.s</th>
                                                    <th style={{ textAlign: 'right' }}>M +3d.s</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {indexMeasurements.map((measurement) => (
                                                    <tr key={measurement.id}>
                                                        <td>{measurement.id}</td>
                                                        <td>{measurement.type_age.description}</td>
                                                        <td style={{ textAlign: 'right' }}>{formatNumber(measurement.media)}</td>
                                                        <td style={{ textAlign: 'right' }}>{formatNumber(measurement.dev_std)}</td>
                                                        <td style={{ textAlign: 'right' }}>{formatNumber(measurement.m_minus_3d)}</td>
                                                        <td style={{ textAlign: 'right' }}>{formatNumber(measurement.m_minus_2d)}</td>
                                                        <td style={{ textAlign: 'right' }}>{formatNumber(measurement.m_minus_1d)}</td>
                                                        <td style={{ textAlign: 'right' }}>{formatNumber(measurement.m_plus_1d)}</td>
                                                        <td style={{ textAlign: 'right' }}>{formatNumber(measurement.m_plus_2d)}</td>
                                                        <td style={{ textAlign: 'right' }}>{formatNumber(measurement.m_plus_3d)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>

                                    ) : (
                                        <Alert key="secondary" variant="secondary" className="my-4"><i className="bi bi-info-circle me-2"></i>Folosiți selectoarele de mai sus pentru a obține categoria de indecși doriți.</Alert>
                                    )
                                }
                            </>
                        )}

                </Col>
            </Row>
        </Container>
    );

};
export default OmsIndexesList;
