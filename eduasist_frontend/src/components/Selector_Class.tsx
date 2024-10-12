// src/components/ClassSelector.tsx
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { storageService } from '../services/storageService';

import { Class } from '../types/types';


interface ClassSelectorProps {
    initialClassId: number | null;
    classes: Class[];
    enableAll: boolean;
    onSelectionChange: (classId: number | null) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ initialClassId, classes, enableAll, onSelectionChange }) => {
    //const [classes, setClasses] = useState<Class[]>([]);
    const selectedSchool = storageService.getSelectedSchool();
    const schoolId = selectedSchool ? selectedSchool.id : null;
    
    const [selectedClassId, setSelectedClassId] = useState<number | null>(initialClassId);




    /*
    useEffect(() => {
        const fetchClasses = async () => {
            if (schoolId) {

                try {
                    const response = await apiClient.get(`/api/schools/${schoolId}/classes`);
                    if (response.status == 200) {
                        setClasses(response.data);
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
    }, [schoolId]);




    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const classId = parseInt(e.target.value, 10) || null;
        setSelectedClassId(classId);
        onClassChange(classId);

        if (classId) {
            storageService.setSelectedClass(classId);
        } else {
            storageService.removeSelectedClass()
        }
    };
    */

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parsedValue = parseInt(e.target.value, 10);
        const classId = isNaN(parsedValue) ? null : parsedValue;

        setSelectedClassId(classId);
        onSelectionChange(classId);
      };
  

    return (
        <Form.Group controlId="classSelector">
            <Form.Label>Select Class</Form.Label>
            <Form.Select as="select" value={selectedClassId !== null ? selectedClassId : ''} onChange={handleSelectionChange} disabled={!schoolId}>
                <option value="">Alegeți clasa...</option>
                {enableAll && <option value={0}>Toate clasele</option>}
                {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                        {cls.name}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default ClassSelector;
