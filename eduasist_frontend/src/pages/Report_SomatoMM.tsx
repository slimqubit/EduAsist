import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Table } from 'react-bootstrap';
import { useLocation, useParams, Link } from 'react-router-dom';
import { LoadingData } from '../components/cmpUtils';


import { apiClient } from "../services/apiService";
import { storageService } from "../services/storageService";


import ClassSelector from '../components/Selector_Class';

import { Class, ReportSomaoMM } from '../types/types';

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';

import { b64_ArialN_normal } from '../types/const';
import { formatDateIsoToROM } from '../components/cmpUtils';



const ReportSomatoMM: React.FC = () => {

    const { schoolId } = useParams<{ schoolId: string }>();  // Get the id and studentId from the path   

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialClassId = queryParams.get('classId');
    const [classId, setClassId] = useState<number | null>(initialClassId ? parseInt(initialClassId, 10) : null);


    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [classes, setClasses] = useState<Class[]>([]);
    const [reportSomaoMM, setReportSomaoMM] = useState<ReportSomaoMM[]>([]);


    const [returnToState, setReturnToState] = useState<string>(classId ? `${location.pathname}?classId=${classId}` : `${location.pathname}`);


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
        const fetchReport = async () => {
            if (schoolId) {
                try {
                    setLoading(true);
                    const response = await apiClient.get(`/api/schools/${schoolId}/somatomm/${classId}`);
                    if (response.status == 200) {
                        const reportData = response.data.map((reportSomaoMM: ReportSomaoMM) => ({
                            ...reportSomaoMM,
                        }));
                        setReportSomaoMM(reportData);
                    }
                    else {
                        setError(response?.data?.message || 'An error occurred.');
                        setReportSomaoMM([]);
                    }
                } catch (error) {
                    setError(`An error occurred. ${error}`);
                    setReportSomaoMM([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        setError(null);
        fetchReport();
    }, [classId]);


    const exportPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');


        // Set title and subtitle
        const title = "Raport de Măsurători";
        const subtitle = "Informații despre elevi și măsurători";

        doc.addFileToVFS('ARIALN-normal.ttf', b64_ArialN_normal);
        doc.addFont('ARIALN-normal.ttf', 'ARIALN', 'normal');
        doc.addFileToVFS('ARIALNB-bold.ttf', b64_ArialN_normal);
        doc.addFont('ARIALNB-bold.ttf', 'ARIALNB', 'normal');


        // Add title and subtitle to the PDF
        doc.setFont('ARIALNB');
        doc.setFontSize(18);
        doc.text(title, 14, 18);
        doc.setFont('ARIALN');
        doc.setFontSize(12);
        doc.text(subtitle, 14, 26);


        // Add the date to the right of the subtitle
        doc.setFontSize(10);
        const dateText = "Listat la data " + formatDateIsoToROM(new Date().toISOString());
        const pageWidth = doc.internal.pageSize.getWidth();
        const dateTextWidth = doc.getTextWidth(dateText);
        doc.text(dateText, pageWidth - dateTextWidth - 14, 26); // Align to right




        // Define the columns and data for the table
        const columns = [
            "Nume elev", "CNP", "Data nașterii", "Sex", "Resedință", "Clasa",
            "Data măsurătorii", "Vârsta OMS", "Înălțime", "Greutate", "IMC", "Rezultat"
        ];

        const rows = reportSomaoMM.map(student => {
            if (student.measurementDate) {
                return [
                    `${student.lastName} ${student.firstName}`,
                    student.cnp,
                    formatDateIsoToROM(student.dateOfBirth),
                    student.gender,
                    student.residence,
                    student.grade,
                    formatDateIsoToROM(student.measurementDate),
                    student.omsAge,
                    student.height,
                    student.weight,
                    student.resImc,
                    `h${student.resHeight} / g${student.resWeight}`
                ];
            } else {
                return [
                    `${student.lastName} ${student.firstName}`,
                    student.cnp,
                    formatDateIsoToROM(student.dateOfBirth),
                    student.gender,
                    student.residence,
                    student.grade,
                    "N/A",
                    "N/A",
                    "N/A",
                    "N/A",
                    "N/A",
                    "N/A"
                ];
            }
        });

        //doc.autoTable({
        //});

        autoTable(doc, {
            head: [columns],
            body: rows,
            styles: {
                font: "ARIALN",
            },
            startY: 32, // Start the table below the title and subtitle
        });

        // Save the PDF
        doc.save('report.pdf');
    };


    const exportExcel = () => {
        const title = "Raport de Măsurători";
        const subtitle = "Informații despre elevi și măsurători";

        // Prepare data for the Excel sheet
        const data = reportSomaoMM.map(student => {
            if (student.measurementDate) {
                return {
                    "Nume elev": `${student.lastName} ${student.firstName}`,
                    "CNP": student.cnp,
                    "Data nașterii": formatDateIsoToROM(student.dateOfBirth),
                    "Sex": student.gender,
                    "Resedință": student.residence,
                    "Clasa": student.grade,
                    "Data măsurătorii": formatDateIsoToROM(student.measurementDate),
                    "Vârsta OMS": student.omsAge,
                    "Înălțime": student.height,
                    "Greutate": student.weight,
                    "IMC": student.resImc,
                    "Rezultat": `h${student.resHeight} / g${student.resWeight}`
                };
            } else {
                return {
                    "Nume elev": `${student.lastName} ${student.firstName}`,
                    "CNP": student.cnp,
                    "Data nașterii": formatDateIsoToROM(student.dateOfBirth),
                    "Sex": student.gender,
                    "Resedință": student.residence,
                    "Clasa": student.grade,
                    "Data măsurătorii": "N/A",
                    "Vârsta OMS": "N/A",
                    "Înălțime": "N/A",
                    "Greutate": "N/A",
                    "IMC": "N/A",
                    "Rezultat": "Pentru acest elev nu au fost realizate măsurători!"
                };
            }
        });

        // Create a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Add title and subtitle to the worksheet
        const titleRow = [{ A: title }];
        const subtitleRow = [{ A: subtitle }];

        // Prepend title and subtitle rows
        const titleSheet = XLSX.utils.sheet_add_json(worksheet, titleRow, { skipHeader: true, origin: 'A1' });
        XLSX.utils.sheet_add_json(titleSheet, subtitleRow, { skipHeader: true, origin: 'A2' });

        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, titleSheet, 'Raport');

        // Export the workbook to Excel
        XLSX.writeFile(workbook, 'report.xlsx');
    };

    return (

        <Container>
            <Row className="justify-content-md-center">
                <Col>
                    <h3 className="my-4">Lista elevilor pe clase</h3>

                    {error && <Alert key="danger" variant="danger">{error}</Alert>}

                    <Row className='mb-4'>
                        {/* Class Selector */}
                        <ClassSelector
                            initialClassId={classId}
                            classes={classes}
                            enableAll={false}
                            enableGroup={true}
                            onSelectionChange={handleClassChange}

                        />
                    </Row>

                    {loading
                        ? (<LoadingData />)
                        : (
                            <>
                                {reportSomaoMM.length > 0 ?
                                    (
                                        <Table className='report-table'>
                                            <thead>
                                                <tr>
                                                    <th>Nume elev</th>
                                                    <th>CNP</th>
                                                    <th>Data nașterii</th>
                                                    <th>Sex</th>
                                                    <th>Resedință</th>
                                                    <th>Clasa</th>
                                                    <th>Data măsurătorii</th>
                                                    <th>Vârsta OMS</th>
                                                    <th>Înălțime</th>
                                                    <th>Greutate</th>
                                                    <th>IMC</th>
                                                    <th>Rezultat</th>
                                                    <th className="actions-center">Acțiuni</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportSomaoMM.map((student) => (
                                                    <tr key={student.id}>
                                                        <td>{student.lastName} {student.firstName} </td>
                                                        <td>{student.cnp}</td>
                                                        <td>{formatDateIsoToROM(student.dateOfBirth)}</td>
                                                        <td>{student.gender}</td>
                                                        <td>{student.residence}</td>
                                                        <td>{student.grade}</td>
                                                        {student.measurementDate
                                                            ? (
                                                                <>
                                                                    <td>{formatDateIsoToROM(student.measurementDate)}</td>
                                                                    <td>{student.omsAge}</td>
                                                                    <td>{student.height}</td>
                                                                    <td>{student.weight}</td>
                                                                    <td>{student.resImc}</td>
                                                                    <td>h{student.resHeight} / g{student.resWeight}</td>
                                                                    <td className="actions-end"></td>
                                                                </>
                                                            )
                                                            : (<td colSpan={7} className="text-muted text-center">Pentru acest elev nu au fost realizate măsurători!</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>

                                    ) : (
                                        <Alert key="secondary" variant="secondary" className="my-4">
                                            <i className="bi bi-info-circle me-2"></i>
                                            Nu există date pentru elevii din clasa selectată.
                                        </Alert>
                                    )
                                }
                            </>
                        )}
                    <div className="mb-3 d-flex justify-content-end">
                        <button onClick={exportPDF} className="btn btn-primary btn-sm mb-3 me-2">Export to PDF</button>
                        <button onClick={exportExcel} className="btn btn-success btn-sm mb-3 ms-2">Export to Excel</button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ReportSomatoMM;
