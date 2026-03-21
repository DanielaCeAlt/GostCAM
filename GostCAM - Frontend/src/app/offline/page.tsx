export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1f2937",
        color: "#f9fafb",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📡</div>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        Sin conexión
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "2rem", maxWidth: "400px" }}>
        No tienes conexión a internet. Verifica tu conexión e intenta de nuevo.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
