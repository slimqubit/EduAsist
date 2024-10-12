import React, { useState } from 'react';
import { Form, ListGroup, Table, Badge } from 'react-bootstrap';
import { formatDateIsoToExpirationDate } from './cmpUtils';
import { Product } from '../types/types';



interface MedicineAutocompleteProps {
    medicines: string[];
    selectedMedicine: string;  // Pass query from parent
    setSelectedMedicine: (value: string) => void;  // Allow parent to update query
}

const MedicineAutocomplete: React.FC<MedicineAutocompleteProps> = ({ medicines, selectedMedicine, setSelectedMedicine }) => {
    const [filteredMedicines, setFilteredMedicines] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedMedicine(value);

        if (value) {
            const filtered = medicines.filter((medicine) =>
                medicine.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredMedicines(filtered);
        } else {
            setFilteredMedicines([]);
        }
    };

    const handleMedicineClick = (name: string) => {
        setSelectedMedicine(name);
        setFilteredMedicines([]);
    };

    return (
        <div className="dropdown-container">
            <Form.Control
                type="text"
                placeholder="Introdu numele medicamentului"
                value={selectedMedicine}
                onChange={handleInputChange}
            />
            {filteredMedicines.length > 0 && (
                <ListGroup className="dropdown-list">
                    {filteredMedicines.map((medicine, index) => (
                        <ListGroup.Item 
                            key={index} 
                            onClick={() => handleMedicineClick(medicine)}
                            style={{ cursor: 'pointer' }}
                        >
                            {medicine}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};


{/*
    
                    <ListGroup className="dropdown-list">
                    {filteredProducts.map((product) => (
                        <ListGroup.Item
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            style={{ cursor: 'pointer' }}
                        >

    
    */}

const isExpired = (expirationDate: string) => {
    const currentDate = new Date();
    const expDate = new Date(expirationDate);
    return expDate < currentDate;  // Verifică dacă data expirării este mai mică decât data curentă
};

interface MedicineTableProps {
    productList: Product[];
}

const MedicineTable: React.FC<MedicineTableProps> = ({ productList }) => {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Denumire dispozitiv</th>
                    <th className='text-center'>Data expirare</th>
                    <th className='text-center'>Stoc</th>
                    <th className='text-center'>U/m</th>
                </tr>
            </thead>
            <tbody>
                {productList.map((product, index) => {
                    const expired = isExpired(product.expirationDate);

                    return (
                        <tr key={index}>
                            <td className={expired ? 'medicine-expired' : ''}>{product.name} {expired && <strong>(expirat)</strong>}</td>
                            <td className={`text-center ${expired ? 'medicine-expired' : ''}`}>{formatDateIsoToExpirationDate(product.expirationDate)}</td>
                            <td className={`text-center ${expired ? 'medicine-expired' : ''}`}>{product.stock}</td>
                            <td className={`text-center ${expired ? 'medicine-expired' : ''}`}>{product.type_unit.unit}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};






interface MedicineSelectorProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
}

const MedicineSelector: React.FC<MedicineSelectorProps> = ({ products, onProductSelect }) => {
    const [query, setQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    };

    const handleProductClick = (product: Product) => {
        setQuery(product.name);
        setFilteredProducts([]);
        onProductSelect(product);
    };

    return (
        <div className="dropdown-container">
            <Form.Control
                type="text"
                placeholder="Enter product name"
                value={query}
                onChange={handleInputChange}
            />
            {filteredProducts.length > 0 && (
                <ListGroup className="dropdown-list">
                    {filteredProducts.map((product) => (
                        <ListGroup.Item
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{product.name}</strong>
                                    <small className="text-muted"> ({product.type_unit.unit})</small>

                                    <div className="text-muted"><small>Expiră în: {formatDateIsoToExpirationDate(product.expirationDate)}</small></div>
                                </div>
                                <Badge bg="secondary">{product.stock}</Badge>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};



export { MedicineAutocomplete, MedicineTable, MedicineSelector };

