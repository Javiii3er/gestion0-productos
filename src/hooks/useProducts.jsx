import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { apiGetProducts, apiCreateProduct, apiDeleteProduct, apiUpdateProduct } from '../services/products.api.js';

const ProductsContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
  query: '',
  page: 1,
  pageSize: 6,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'CREATE_OPTIMISTIC':
      return { ...state, items: [action.payload, ...state.items] };
    case 'UPDATE_OPTIMISTIC': {
      const items = state.items.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p);
      return { ...state, items };
    }
    case 'DELETE_OPTIMISTIC':
      return { ...state, items: state.items.filter(p => p.id !== action.payload) };
    default:
      return state;
  }
}

export function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function load() {
    dispatch({ type: 'LOAD_START' });
    try {
      const data = await apiGetProducts();
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'LOAD_ERROR', payload: err.message || 'Error al cargar' });
    }
  }

  useEffect(() => { load(); }, []);

  // CRUD con Optimistic UI
  async function createProduct(values) {
    const tempId = Date.now() * -1;
    const optimisticItem = { id: tempId, ...values };
    dispatch({ type: 'CREATE_OPTIMISTIC', payload: optimisticItem });

    try {
      const created = await apiCreateProduct(values);
      dispatch({
        type: 'UPDATE_OPTIMISTIC',
        payload: { ...created, id: created.id ?? tempId },
      });
      return created;
    } catch (err) {
      dispatch({ type: 'DELETE_OPTIMISTIC', payload: tempId });
      dispatch({ type: 'LOAD_ERROR', payload: 'No se pudo crear: ' + (err.message || '') });
      throw err;
    }
  }

  async function updateProduct(id, values) {
    const prev = state.items.find(p => p.id === id);
    dispatch({ type: 'UPDATE_OPTIMISTIC', payload: { id, ...values } });

    try {
      await apiUpdateProduct(id, values);
    } catch (err) {
      if (prev) dispatch({ type: 'UPDATE_OPTIMISTIC', payload: prev });
      dispatch({ type: 'LOAD_ERROR', payload: 'No se pudo actualizar: ' + (err.message || '') });
      throw err;
    }
  }

  async function deleteProduct(id) {
    const prev = state.items.find(p => p.id === id);
    dispatch({ type: 'DELETE_OPTIMISTIC', payload: id });
    try {
      await apiDeleteProduct(id);
    } catch (err) {
      if (prev) dispatch({ type: 'CREATE_OPTIMISTIC', payload: prev });
      dispatch({ type: 'LOAD_ERROR', payload: 'No se pudo eliminar: ' + (err.message || '') });
      throw err;
    }
  }

  function setQuery(q) {
    dispatch({ type: 'SET_QUERY', payload: q });
  }
  
  function setPage(p) {
    dispatch({ type: 'SET_PAGE', payload: p });
  }

  // Filtrado + paginación en cliente
  const filtered = useMemo(() => {
    const q = state.query.trim().toLowerCase();
    if (!q) return state.items;
    return state.items.filter(p => (p.title || '').toLowerCase().includes(q));
  }, [state.items, state.query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  const currentPage = Math.min(state.page, totalPages);
  const start = (currentPage - 1) * state.pageSize;
  const pageItems = filtered.slice(start, start + state.pageSize);

  const value = {
    ...state,
    load,
    createProduct,
    updateProduct,
    deleteProduct,
    setQuery,
    setPage,
    filtered,
    pageItems,
    totalPages,
    currentPage,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider');
  return ctx;
}
