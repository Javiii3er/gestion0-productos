export default function ProductTable({ items, onEdit, onDelete, loading }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th style={{width: 80}}>ID</th>
            <th>Título</th>
            <th style={{width: 140}}>Precio</th>
            <th style={{width: 180}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {!loading && items.length === 0 && (
            <tr><td colSpan="4"><div className="empty-state">Sin resultados</div></td></tr>
          )}
          {items.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>${Number(p.price).toFixed(2)}</td>
              <td>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(p)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(p)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
          {loading && (
            <tr><td colSpan="4">Cargando...</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
