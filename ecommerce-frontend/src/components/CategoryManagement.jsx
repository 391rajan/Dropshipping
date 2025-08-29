// src/components/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import CategoryForm from './CategoryForm'; // Import CategoryForm

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/categories'); // Assumes admin token is sent
      if (!response.ok) {
        throw new Error('Failed to fetch categories. Are you an admin?');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFormSubmit = async (formData) => {
    const method = editingCategory ? 'PUT' : 'POST';
    const url = editingCategory
      ? `http://localhost:5000/api/categories/${editingCategory._id}`
      : 'http://localhost:5000/api/categories';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save category.');
      }

      handleCloseModal();
      fetchCategories(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete category.');
        }

        fetchCategories(); // Refresh list
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleAddNewClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Categories</h2>
        <button onClick={handleAddNewClick} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300">
          + Add New Category
        </button>
      </div>

      {loading && <p>Loading categories...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Slug</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Parent</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{category.name}</td>
                  <td className="py-3 px-4">{category.slug}</td>
                  <td className="py-3 px-4">{category.parent?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleEditClick(category)} className="text-blue-500 hover:text-blue-700 font-medium mr-4">Edit</button>
                    <button onClick={() => handleDelete(category._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCategory ? 'Edit Category' : 'Add New Category'}>
        <CategoryForm 
          initialData={editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default CategoryManagement;
