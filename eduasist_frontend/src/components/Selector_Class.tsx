// src/components/ClassSelector.tsx
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { storageService } from '../services/storageService';

import { Class } from '../types/types';


interface ClassSelectorProps {
    initialClassId: number | null;
    classes: Class[];
    enableAll: boolean;
    enableGroup: boolean;
    onSelectionChange: (classId: number ) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ initialClassId, classes, enableAll, enableGroup, onSelectionChange }) => {
    //const [classes, setClasses] = useState<Class[]>([]);
    const selectedSchool = storageService.getSelectedSchool();
    const schoolId = selectedSchool ? selectedSchool.id : null;
    
    const [selectedClassId, setSelectedClassId] = useState<number | null>(initialClassId);

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parsedValue = parseInt(e.target.value, 10);
        const classId = isNaN(parsedValue) ? 0 : parsedValue;

        setSelectedClassId(classId);
        onSelectionChange(classId);
      };
  

    return (
        <Form.Group controlId="classSelector">
            <Form.Label>Clasa</Form.Label>
            <Form.Select as="select" value={selectedClassId !== null ? selectedClassId : ''} onChange={handleSelectionChange} disabled={!schoolId} required>
                <option value="">Alegeți clasa...</option>
                {enableAll && <option value={111}>Toate clasele</option>}
                {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                        {cls.name}
                    </option>
                ))}
                {enableGroup && <option value="102">Toate clasele de gimnaziu</option>}
                {enableGroup && <option value="103">Toate clasele de liceu</option>}
            </Form.Select>
        </Form.Group>
    );
};

export default ClassSelector;
