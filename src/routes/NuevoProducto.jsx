import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm.jsx';
import { useProducts } from '../hooks/useProducts.jsx'; 

export default function NuevoProducto() {
  const { createProduct } = useProducts();
  const navigate = useNavigate();

  async function handleSubmit(values) {
    await createProduct(values);
    navigate('/');
  }

  return (
    <div className="card">
      <div className="card-header">Nuevo producto</div>
      <div className="card-body">
        <ProductForm
          initialValues={{ 
            title: '', 
            price: '', 
            description: '', 
            category: '', 
            image: '' 
          }}
          onSubmit={handleSubmit}
          submitLabel="Crear producto" 
          onCancel={() => navigate('/')}
        />
      </div>
    </div>
  );
}