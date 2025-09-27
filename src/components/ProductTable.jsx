export default function ProductTable({ items, onEdit, onDelete, loading }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th style={{width: 100}}>Imagen</th>
            <th>Producto</th>
            <th style={{width: 120}}>Precio</th>
            <th style={{width: 120}}>Categoría</th>
            <th style={{width: 180}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {!loading && items.length === 0 && (
            <tr><td colSpan="5"><div className="empty-state">Sin resultados</div></td></tr>
          )}
          {items.map(product => (
            <tr key={product.id}>
              <td>
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="img-thumbnail"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                  }}
                />
              </td>
              <td>
                <div>
                  <strong>{product.title}</strong>
                  {product.description && (
                    <small className="d-block text-muted">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </small>
                  )}
                </div>
              </td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>
                <span className="badge bg-secondary">{product.category}</span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(product)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(product)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {loading && (
            <tr><td colSpan="5">Cargando productos...</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}