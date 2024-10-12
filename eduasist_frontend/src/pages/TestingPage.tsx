
import React from 'react';

import { Container, Row, Col, Button, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiService';


import { useState } from 'react';



interface Product {
    id: number;
    name: string;
    expirationDate: string;
    stock: number;
}




const TestingPage: React.FC = () => {

    /* TEST */


    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Product A', expirationDate: '2024-12-31', stock: 100 },
        { id: 2, name: 'Product B', expirationDate: '2025-06-30', stock: 50 },
    ]);

    const [editRowId, setEditRowId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Product>>({});
    const [newRowData, setNewRowData] = useState<Partial<Product>>({});
    const [isAddingNewRow, setIsAddingNewRow] = useState(false);

    // Handle input changes for editing an existing row
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle input changes for adding a new row
    const handleNewRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewRowData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle editing an existing row
    const handleEditClick = (id: number) => {
        setEditRowId(id);
        const product = products.find((p) => p.id === id);
        if (product) {
            setEditData(product);
        }
    };

    // Save edited row
    const handleSaveClick = () => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === editRowId ? { ...product, ...editData } : product
            )
        );
        setEditRowId(null);
    };

    // Add a new row to the table
    const handleAddNewRow = () => {
        if (newRowData.name && newRowData.expirationDate && newRowData.stock) {
            const newProduct: Product = {
                id: products.length + 1, // In a real app, you'd generate or fetch an ID from the backend
                name: newRowData.name,
                expirationDate: newRowData.expirationDate,
                stock: newRowData.stock,
            };
            setProducts((prevProducts) => [...prevProducts, newProduct]);
            setNewRowData({});
            setIsAddingNewRow(false);
        } else {
            alert('Please fill in all fields');
        }
    };






    return (
        <Container fluid>
            <Row className="my-4">
                <Col>
                    <h2>Testing Page</h2>
                </Col>
            </Row>
            <Row>
                <Alert key="secondary" variant="secondary">Exemplificare <strong>In-Table Editing</strong></Alert>
            </Row>


            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Expiration Date</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                                {editRowId === product.id ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    product.name
                                )}
                            </td>
                            <td>
                                {editRowId === product.id ? (
                                    <input
                                        type="date"
                                        name="expirationDate"
                                        value={editData.expirationDate || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    product.expirationDate
                                )}
                            </td>
                            <td>
                                {editRowId === product.id ? (
                                    <input
                                        type="number"
                                        name="stock"
                                        value={editData.stock || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    product.stock
                                )}
                            </td>
                            <td>
                                {editRowId === product.id ? (
                                    <Button variant="success" onClick={handleSaveClick}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button variant="primary" onClick={() => handleEditClick(product.id)}>
                                        Edit
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}

                    {/* Adding a new row */}
                    {isAddingNewRow && (
                        <tr>
                            <td>#</td>
                            <td>
                                <input
                                    type="text"
                                    name="name"
                                    value={newRowData.name || ''}
                                    onChange={handleNewRowChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="date"
                                    name="expirationDate"
                                    value={newRowData.expirationDate || ''}
                                    onChange={handleNewRowChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="stock"
                                    value={newRowData.stock || ''}
                                    onChange={handleNewRowChange}
                                />
                            </td>
                            <td>
                                <Button variant="success" onClick={handleAddNewRow}>
                                    Save
                                </Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Button to add a new row */}
            {!isAddingNewRow && (
                <Button variant="primary" onClick={() => setIsAddingNewRow(true)}>
                    Add New Row
                </Button>
            )}
            <Row className="my-4">
            </Row>

        </Container>
    );
};

export default TestingPage;
