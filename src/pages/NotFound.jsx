import { useNavigate } from "react-router-dom";

export default function NotFound({
  code = "404",
  title = "Page Not Found",
  description = "Halaman tidak ditemukan atau sudah dipindahkan.",
}) {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.bgCircle}></div>

      <div style={styles.container}>
        {/* ERROR CODE */}
        <h1 style={styles.code}>{code}</h1>

        {/* TITLE */}
        <h2 style={styles.title}>{title}</h2>

        {/* DESCRIPTION */}
        <p style={styles.desc}>{description}</p>

        {/* BUTTONS */}
        <div style={styles.buttons}>
          <button style={styles.primary} onClick={() => navigate("/")}>
            Dashboard
          </button>

          <button style={styles.secondary} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

/* STYLE */
const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fdf2f8", // pink very light
    fontFamily: "Poppins",
    position: "relative",
    overflow: "hidden",
  },

  bgCircle: {
    position: "absolute",
    width: "450px",
    height: "450px",
    background: "#EC4899", // pink
    borderRadius: "50%",
    filter: "blur(150px)",
    opacity: "0.2",
  },

  container: {
    textAlign: "center",
    zIndex: 2,
  },

  code: {
    fontSize: "120px",
    fontWeight: "800",
    color: "#EC4899", // pink
    margin: 0,
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
    marginTop: "10px",
  },

  desc: {
    color: "#777",
    maxWidth: "400px",
    margin: "15px auto 30px",
    lineHeight: "1.6",
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },

  primary: {
    background: "#EC4899", // pink
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  secondary: {
    background: "transparent",
    border: "2px solid #EC4899", // pink
    color: "#EC4899",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};