import { useState } from 'react';
import { useProducts } from '../hooks/useProducts.jsx';
import ProductTable from '../components/ProductTable.jsx';
import Modal from '../components/Modal.jsx';
import ProductForm from '../components/ProductForm.jsx';

export default function ProductosList() {
  const {
    pageItems, loading, error, setQuery, query,
    currentPage, totalPages, setPage,
    updateProduct, deleteProduct
  } = useProducts();

  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  function handleEditSubmit(values) {
    updateProduct(editing.id, {
      title: values.title,
      price: values.price,
      description: values.description,
    });
    setEditing(null);
  }

  function handleConfirmDelete() {
    deleteProduct(toDelete.id);
    setToDelete(null);
  }

  return (
    <div className="vstack gap-3">
      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Buscar por título..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Buscar por título"
        />
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <ProductTable
        items={pageItems}
        loading={loading}
        onEdit={setEditing}
        onDelete={setToDelete}
      />

      {/* Paginación simple */}
      <nav aria-label="Paginación">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(currentPage - 1)}>Anterior</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <li key={n} className={`page-item ${n === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(n)}>{n}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(currentPage + 1)}>Siguiente</button>
          </li>
        </ul>
      </nav>

      {/* Modal de edición */}
      <Modal
  isOpen={!!editing}
  title="Editar producto"
  onClose={() => setEditing(null)}
>
  {editing && (
    <ProductForm
      initialValues={{
        title: editing.title ?? '',
        price: editing.price ?? '',
        description: editing.description ?? '',
        category: editing.category ?? '',
        image: editing.image ?? '',
      }}
      onSubmit={handleEditSubmit}
      submitLabel="Guardar cambios"
      onCancel={() => setEditing(null)}
    />
  )}
</Modal>

      {/* Modal de confirmación de borrado */}
      <Modal
        isOpen={!!toDelete}
        title="Confirmar eliminación"
        onClose={() => setToDelete(null)}
      >
        <p>¿Seguro que deseas eliminar <strong>{toDelete?.title}</strong>?</p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
          <button className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
