import { useState } from 'react';

const defaultValues = {
  title: '',
  price: '',
  description: '',
  category: '',
  image: '',
};

export default function ProductForm({ initialValues = {}, onSubmit, submitLabel = 'Guardar', onCancel }) {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState({});

  function validate(v) {
    const errs = {};
    if (!v.title || v.title.trim() === '') errs.title = 'El título es requerido';
    const priceNum = Number(v.price);
    if (Number.isNaN(priceNum) || priceNum <= 0) errs.price = 'El precio debe ser mayor a 0';
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: name === 'price' ? value.replace(',', '.') : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      const payload = { ...values, price: Number(values.price) };
      onSubmit?.(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* 1. Título (Requerido y Validado) */}
      <div className="mb-3">
        <label className="form-label">Título *</label>
        <input name="title" className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              value={values.title} onChange={handleChange} />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      {/* 2. Precio (Requerido y Validado) */}
      <div className="mb-3">
        <label className="form-label">Precio *</label>
        <input name="price" type="number" step="0.01"
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              value={values.price} onChange={handleChange} />
        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
      </div>

      {/* 3. Descripción (Ahora siempre visible) */}
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea name="description" className="form-control" rows="3"
                  value={values.description} onChange={handleChange} />
      </div>

      {/* 4. Categoría (Ahora siempre visible) */}
      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <input name="category" className="form-control"
              value={values.category} onChange={handleChange} />
      </div>

      {/* 5. URL de imagen (Ahora siempre visible + Vista previa) */}
      <div className="mb-3">
        <label className="form-label">URL de imagen</label>
        <input name="image" className="form-control"
              value={values.image} onChange={handleChange} />
        {/* Lógica de la vista previa: toma lo mejor del código nuevo */}
        {values.image && (
          <div className="mt-2">
            <img 
              src={values.image} 
              alt="Vista previa" 
              style={{maxWidth: '100px', maxHeight: '100px'}} 
              onError={(e) => e.target.style.display = 'none'} 
            />
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="d-flex gap-2 justify-content-end">
        {onCancel && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>}
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}
