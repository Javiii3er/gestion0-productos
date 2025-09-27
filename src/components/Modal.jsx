import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, title, children, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    window.addEventListener('keydown', onKey);
    // foco inicial
    const firstFocusable = ref.current?.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    firstFocusable?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function onBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div className="modal-backdrop-custom" onMouseDown={onBackdropClick}>
      <div
        className="modal d-block"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ inset: 0 }}
      >
        <div className="modal-dialog modal-dialog-centered" onMouseDown={e => e.stopPropagation()}>
          <div className="modal-content" ref={ref}>
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
