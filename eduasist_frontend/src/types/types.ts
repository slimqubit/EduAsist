
export interface School {
    id?: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    county: string;
    address: string;
    residenceId: number;
}

export interface Class {
    id?: string;
    grade: number;
    letter: string;
    class_master: string;
    name?: string;
    schoolId?: number;
}

export interface Student {
    id?: string;
    firstName: string;
    lastName: string;
    cnp: string;
    dateOfBirth: string;
    genderId: number;
    address: string;
    schoolId?: number;
    classId?: number;
    class?: Class;
    type_gender?: TypeGender;
}

export interface SomatoMM {
    id?: string;
    measurementDate: string;
    height: number;
    weight: number;
    chestCircumference: number;
    headCircumference: number;
    studentId: number;
    omsAge?: number;
    ageMonths?: number;
    resImc?: number;
    resHeight?: number;
    resWeight?: number;
    resCCest?: number;
    resCHead?: number;
}

export interface ProductMove {
    id?: number
    name: string;
    quantity: number;
    unitId: number;
    expirationDate: string;
    movementDate: string;
}

export interface Product {
    id?: number
    name: string;
    expirationDate: string;
    stock: number;
    unitId: number;
    type_unit: TypeUnit;
}

export interface ProductAdd {
    id?: number
    name: string;
    quantity: number;
    unitId: number;
    expMonth: string;
    expYear: string;
    dateAdded: string;
}


// types

export interface TypeAge {
    id: number;
    description: string;
}

export interface TypeGender {
    id: number;
    gender: string;
    gender_pl: string;
}

export interface TypeResidence {
    id: number;
    residence: string;
}

export interface TypeMeasurement {
    id: number;
    measurement: string;
}

export interface TypeUnit {
    id: number;
    unit: string;
}



export interface OmsIndexMeasurement {
    id: number;
    ageId: number;
    residenceId: number;
    measurementId: number;
    genderId: number;
    media: number;
    dev_std: number;
    m_minus_3d: number;
    m_minus_2d: number;
    m_minus_1d: number;
    m_plus_1d: number;
    m_plus_2d: number;
    m_plus_3d: number;
    type_age: { description: string };
}




