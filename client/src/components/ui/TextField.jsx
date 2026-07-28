export default function TextField({ label, error, id, ...rest }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`input ${error ? "border-danger" : ""}`}
        {...rest}
      />

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
