// LoadingSpinner.js

import { Spinner } from 'react-bootstrap';

import { OmsIndexMeasurement } from '../types/types';



// Component 1: LoadingSpinner
const LoadingData = () => {
    return (
        <div className='mb-2'>
            <Spinner animation="grow" size="sm" variant="secondary" />
            <span role="status" className="ms-2 text-secondary">Se încarcă datele ...</span>
        </div>
    );
};


// Convert the ISO date to Romanian lond format dd Month yyyy
const formatDateIsoToRomanian = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
};

// Convert the ISO date to Romanian format dd.MM.yyyy
const formatDateIsoToROM = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ro-RO', options).replace(/\//g, '.');
};

const formatDateIsoToROMEx = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
};

// Convert the Romanian date to ISO format dd.MM.yyyy
const formatDateRomToISO = (dateString: string): string => {
    const [day, month, year] = dateString.split('.');
    return `${year}-${month}-${day}`;
};

const formatDateForInput = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateIsoToExpirationDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
};




const calculateAgeInYears = (birthDate: Date, measurementDate: Date): number => {
    let years = measurementDate.getFullYear() - birthDate.getFullYear();
    let months = measurementDate.getMonth() - birthDate.getMonth();
    const days = measurementDate.getDate() - birthDate.getDate();

    // Ajustează anii dacă luna sau ziua de naștere nu au fost atinse
    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12; // Corectează valoarea negativă a lunilor
    }

    // Calculează fractiunea în termeni de jumătate de an
    const totalMonths = months + (days >= 0 ? 0 : -1); // Ajustează pentru zilele din lună
    const halfYearFraction = totalMonths >= 6 ? 0.5 : 0;

    return years + halfYearFraction;
};


const calculateAgeInMonths = (birthDate: Date, measurementDate: Date): number => {
    let years = measurementDate.getFullYear() - birthDate.getFullYear();
    let months = measurementDate.getMonth() - birthDate.getMonth();
    let days = measurementDate.getDate() - birthDate.getDate();

    // Ajustează dacă luna sau ziua de naștere nu au fost atinse în acest an
    if (days < 0) {
        months--; // Luna nu este completă
        // Ajustează zilele pentru luna precedentă
        const previousMonth = new Date(measurementDate);
        previousMonth.setMonth(measurementDate.getMonth() - 1);
        const daysInPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0).getDate();
        days += daysInPreviousMonth;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // Total luni ca valoare zecimală
    const totalMonths = years * 12 + months; // + days / 30; // Aproximare: o lună are în medie 30 de zile

    return totalMonths;
};

const calculateIMC = (weight: number, height: number) => {
    let imc = weight / (height * height) * 10000;
    return imc;
}


const getOmsIndex = (value: number,  idx: number, omsIdx: OmsIndexMeasurement[]) => {
    const selectedItem: OmsIndexMeasurement | undefined = omsIdx.find(item => item.measurementId === idx);

    if (!selectedItem) return 0;

    if (value >= selectedItem.m_minus_3d && value < selectedItem.m_minus_2d) {
        return 1;
    } else if (value >= selectedItem.m_minus_2d && value < selectedItem.m_minus_1d) {
        return 2;
    } else if (value >= selectedItem.m_minus_1d && value < selectedItem.m_plus_1d) {
        return 3;
    } else if (value >= selectedItem.m_plus_1d && value < selectedItem.m_plus_2d) {
        return 4;
    } else if (value >= selectedItem.m_plus_2d && value < selectedItem.m_plus_3d) {
        return 5;
    } else {
        return 0; // Return null if it doesn't fall in any range
    }
}




export { 
    LoadingData, 
    formatDateIsoToRomanian, 
    formatDateIsoToROM, 
    formatDateIsoToROMEx, 
    formatDateRomToISO, 
    formatDateForInput, 
    formatDateIsoToExpirationDate,

    calculateAgeInYears,
    calculateAgeInMonths,
    calculateIMC,
    getOmsIndex
};
