import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import { storageService } from "../services/storageService";

import useSelectSchoolDialog from './dlgSelectSchool';


const Header: React.FC = () => {
    const { isAuthenticated, username, logout } = useAuth();
    const { confirm, SelectSchoolDialogComponent } = useSelectSchoolDialog();

    const selectedSchool = storageService.getSelectedSchool();
    const schoolName = selectedSchool ? selectedSchool.name : 'Nu a fost selecată nici o școală';
    const schoolId = selectedSchool ? selectedSchool.id : null;

    const handleChangeSchoolDialog = async () => {
        const confirmed = await confirm();
        if (confirmed) {

        }
    };




    return (
        <div>
            {/* Main Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">
                        <img alt="" src='/react.svg' width="30" height="30" className="d-inline-block align-top" />{' '}
                        CRUD application
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {isAuthenticated ? (
                            <>
                                <Nav className="me-auto">
                                    <Nav.Link href="/"><i className="bi bi-globe2"></i></Nav.Link>
                                    <NavDropdown title="Școli" id="basic-nav-dropdown">
                                        <NavDropdown.Item href={`/schools/${schoolId}/info`}>Informații școală</NavDropdown.Item>
                                        <NavDropdown.Item href="/schools">Lista școlilor</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href={`/schools/${schoolId}/edit`}>Modifică datele școalii</NavDropdown.Item>
                                        <NavDropdown.Item href="/schools/add">Adaugă o școală nouă</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={() => handleChangeSchoolDialog()} /*onClick={handleChangeSchoolDialog}*/>Schimbă Școala</NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown title="Clase" id="basic-nav-dropdown">
                                        <NavDropdown.Item href={`/schools/${schoolId}/classes`}>Lista claselor din școală</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href={`/schools/${schoolId}/classes/add`}>Adaugă o clasă nouă</NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown title="Elevi" id="basic-nav-dropdown">
                                        <NavDropdown.Item href={`/schools/${schoolId}/classes/students`}>Lista elevi pe clase</NavDropdown.Item>
                                        <NavDropdown.Item href={`/schools/${schoolId}/classes/students/medicalrecord`}>Dosarul medical al elevului</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href={`/schools/${schoolId}/classes/students/add`}>Adaugă un elev nou</NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown title="Nomenclatoare" id="basic-nav-dropdown">
                                        <NavDropdown.Item href="/medicine_edit">Stoc cabinet medical</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/nom_omsindexeslist">Indici de înălțime și greutate</NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                                <Nav>
                                    <Navbar.Text>Autentificat ca:{'  '}</Navbar.Text>
                                    <NavDropdown title={username} id="basic-nav-dropdown">
                                        <NavDropdown.Item href="#">
                                            <i className="bi bi-person-gear me-2"></i>Profilul meu
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#">
                                            <i className="bi bi-gear me-2"></i>Configurare
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={logout}>Deconectare</NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </>
                        ) : (
                            <>
                                <Nav className="me-auto">
                                    <Nav.Link href="/">Home</Nav.Link>
                                    <Nav.Link href="#">Functionalități</Nav.Link>
                                </Nav>
                                <Nav>
                                    <Nav.Link href="/login">Autentificare</Nav.Link>
                                    <Nav.Link href="/register">Înregistrare</Nav.Link>
                                </Nav>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Sub Navbar */}
            {isAuthenticated && (
                <Navbar bg="light" variant="light" className="sub-navbar">
                    <Container>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end" >
                            <Navbar.Text className='me-3'>Unitatea școlară în lucru:</Navbar.Text>
                            <Navbar.Text className="fw-bold">{schoolName}</Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            )}



            {SelectSchoolDialogComponent}




        </div>
    );
};

export default Header;