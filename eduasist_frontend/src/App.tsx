// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Dashboard from './pages/Dashboard';

import LoginForm from './pages/LoginForm';
import RegistrationForm from './pages/RegistrationForm';

import SchoolList from './pages/List_Schools';
import AddSchoolForm from './pages/EditForm_School';

import ClassList from './pages/List_Classes';
import AddClassForm from './pages/EditForm_Class';

import StudentList from './pages/List_Students';
import AddStudentForm from './pages/EditForm_Student';


import InfoStudentMedicalRecordForm from './pages/InfoForm_Student_MedicalRecord';


import SchoolInfo from './pages/SchoolInfo';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';



import AddMedicineForm from './pages/EditForm_Medicine';
import AddSomatoMMForm from './pages/EditForm_SomatoMM';

import OmsIndexesList from './pages/Nomenclator_Measurements';
import TestingPage from './pages/TestingPage';


import ReportSomatoMM from './pages/Report_SomatoMM';





import './App.css';


const App: React.FC = () => {

    return (
        <Router>
            <AuthProvider>
                <Header />
                <div className="container">
                    <Routes>

                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/login/:id" element={<LoginForm />} />
                        <Route path="/register" element={<RegistrationForm />} />

                        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />

                        <Route path="/schools" element={<PrivateRoute element={<SchoolList />} />} />
                        <Route path="/schools/add" element={<PrivateRoute element={<AddSchoolForm />} />} />
                        <Route path="/schools/:schoolId/edit" element={<PrivateRoute element={<AddSchoolForm />} />} />
                        <Route path="/schools/:schoolId/info" element={<PrivateRoute element={<SchoolInfo />} />} />


                        <Route path="/schools/:schoolId/classes" element={<PrivateRoute element={<ClassList />} />} />
                        <Route path="/schools/:schoolId/classes/add" element={<PrivateRoute element={<AddClassForm />} />} />
                        <Route path="/schools/:schoolId/classes/:classId/edit" element={<PrivateRoute element={<AddClassForm />} />} />
                        <Route path="/schools/:schoolId/classes/:classId/info" element={<PrivateRoute element={<SchoolInfo />} />} />


                        <Route path="/schools/:schoolId/classes/students" element={<PrivateRoute element={<StudentList />} />} />
                        <Route path="/schools/:schoolId/classes/students/add" element={<PrivateRoute element={<AddStudentForm />} />} />
                        <Route path="/schools/:schoolId/classes/:classId/students" element={<PrivateRoute element={<StudentList />} />} />
                        <Route path="/schools/:schoolId/classes/:classId/students/add" element={<PrivateRoute element={<AddStudentForm />} />} />
                        <Route path="/schools/:schoolId/classes/:classId/students/edit/:studentId" element={<PrivateRoute element={<AddStudentForm />} />} />

                        <Route path="/schools/:schoolId/classes/:classId/students/:studentId/medicalrecord" element={<PrivateRoute element={<InfoStudentMedicalRecordForm />} />} />
                        <Route path="/schools/:schoolId/classes/students/medicalrecord" element={<PrivateRoute element={<InfoStudentMedicalRecordForm />} />} />


                        <Route path="/schools/:schoolId/classes/:classId/students/:studentId/somatomm/add" element={<PrivateRoute element={<AddSomatoMMForm />} />} />
                        <Route path="/schools/:schoolId/classes/:classId/students/:studentId/somatomm/edit/:somatommId" element={<PrivateRoute element={<AddSomatoMMForm />} />} />


                        <Route path="/medicine_edit" element={<PrivateRoute element={<AddMedicineForm />} />} />


                        {/* Reports */}
                        <Route path="/schools/:schoolId/reports/somatomm" element={<PrivateRoute element={<ReportSomatoMM />} />} />



                        {/* onStudentAdded={function (): void { useNavigate()(-1); }} */}
                        {/* classId={classId} */}

                        <Route path="/nom_omsindexeslist" element={<PrivateRoute element={<OmsIndexesList />} />} />


                        <Route path="/test_page" element={<PrivateRoute element={<TestingPage />} />} />


                    </Routes>
                </div>
                <Footer />
            </AuthProvider>
        </Router>
    );
};

export default App;
