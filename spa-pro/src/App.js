import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= COMPONENTE LOGIN (ACCESO LIBRE) ================= */

function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ahora permite el ingreso con cualquier dato ingresado
    if (user.trim() !== "" && pass.trim() !== "") {
      onLogin();
    } else {
      alert("Por favor, completa ambos campos para continuar.");
    }
  };

  return (
    <div style={{ 
      height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", 
      background: "#000", color: "white", fontFamily: "sans-serif" 
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: "100%", maxWidth: "400px", padding: "40px", textAlign: "center", background: "#111", borderRadius: "30px", border: "1px solid #333" }}
      >
        <h1 style={{ fontWeight: "900", fontSize: "32px", marginBottom: "10px" }}>APONA<span style={{ color: "#ff1f1f" }}>MOTORS</span></h1>
        <p style={{ opacity: 0.6, marginBottom: "30px" }}>PANEL DE ACCESO</p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="text" placeholder="Cualquier Usuario" 
            style={{ padding: "15px", borderRadius: "12px", border: "1px solid #333", background: "#000", color: "white" }}
            value={user} onChange={(e) => setUser(e.target.value)}
            required
          />
          <input 
            type="password" placeholder="Cualquier Contraseña" 
            style={{ padding: "15px", borderRadius: "12px", border: "1px solid #333", background: "#000", color: "white" }}
            value={pass} onChange={(e) => setPass(e.target.value)}
            required
          />
          <button type="submit" style={{ background: "#ff1f1f", color: "white", border: "none", padding: "15px", borderRadius: "12px", fontWeight: "900", cursor: "pointer", marginTop: "10px" }}>
            ENTRAR
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ================= COMPONENTES REUTILIZABLES ================= */

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

/* ================= MODAL DE FLUJO DE PAGO ================= */

function CheckoutModal({ isOpen, onClose, moto, darkMode }) {
  const [step, setStep] = useState(1);
  const [metodo, setMetodo] = useState("");
  const [cuotas, setCuotas] = useState(12);

  if (!isOpen || !moto) return null;
  const theme = darkMode ? darkTheme : lightTheme;
  
  const totalCOP = parseInt(moto.cop.replace(/'/g, '').replace(/\./g, ''));
  const calcularCuota = () => {
    const interes = metodo === "Addi" ? 0 : 0.021; 
    const totalConInteres = totalCOP * (1 + interes);
    return Math.round(totalConInteres / cuotas).toLocaleString();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={modalOverlay}>
        <motion.div 
          initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
          style={{ ...modalStyle, background: theme.card, color: theme.text }}
        >
          <button onClick={() => { setStep(1); onClose(); }} style={{ ...btnClose, color: theme.text }}>✕</button>
          
          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: "900", color: "#ff1f1f" }}>FINANCIAR MI {moto.nombre}</h2>
              <p>Precio de lista: <strong>${moto.cop} COP</strong></p>
              <div style={gridMetodos}>
                <button onClick={() => { setMetodo("Addi"); setStep(2); }} style={btnMetodo}>PAGAR CON ADDI (0% INT)</button>
                <button onClick={() => { setMetodo("Bancolombia"); setStep(2); }} style={btnMetodo}>CRÉDITO SUFI / BANCOLOMBIA</button>
                <button onClick={() => { setMetodo("Efectivo"); setStep(3); }} style={btnMetodo}>TRANSFERENCIA BANCARIA</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontWeight: "900" }}>PLAN DE CUOTAS ({metodo})</h2>
              <div style={{ margin: "20px 0", padding: "20px", background: "#ff1f1f15", borderRadius: "15px", border: "1px solid #ff1f1f50" }}>
                <h3 style={{ color: "#ff1f1f", margin: 0 }}>{cuotas} cuotas de ${calcularCuota()} COP</h3>
              </div>
              <p style={{ fontSize: "14px" }}>Selecciona el plazo: <strong>{cuotas} meses</strong></p>
              <input type="range" min="3" max="48" step="3" value={cuotas} onChange={(e) => setCuotas(e.target.value)} style={{ width: "100%", accentColor: "#ff1f1f" }} />
              <button style={{ ...btnPrincipal, width: "100%", marginTop: "30px" }} onClick={() => setStep(3)}>SOLICITAR ESTUDIO</button>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>🏁</div>
              <h2 style={{ fontWeight: "900" }}>¡SOLICITUD ENVIADA!</h2>
              <p>Nicolás, un asesor experto te contactará pronto para tu <strong>{moto.nombre}</strong>.</p>
              <button style={{ ...btnPrincipal, width: "100%", marginTop: "20px" }} onClick={() => { setStep(1); onClose(); }}>VOLVER</button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ================= BOTÓN WHATSAPP ================= */

function WhatsAppButton() {
  const phoneNumber = "573167244892"; 
  const message = "Hola Apona Motors, me gustaría recibir más información sobre una moto.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a href={url} target="_blank" rel="noopener noreferrer" style={whatsappFloat} whileHover={{ scale: 1.1 }}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "35px" }} />
    </motion.a>
  );
}

/* ================= HOME ================= */

function Home({ darkMode }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: "", telefono: "", motivo: "" });
  const [enviado, setEnviado] = useState(false);

  const handleCita = (e) => {
    e.preventDefault();
    setEnviado(true);
    setFormData({ nombre: "", telefono: "", motivo: "" });
    setTimeout(() => setEnviado(false), 5000);
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <div style={{ background: theme.bg, color: theme.text, transition: "0.3s" }}>
      <section style={heroSection}>
        <div style={heroOverlay}></div>
        <motion.div style={heroContent} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <span style={heroBadge}>DISTRIBUIDOR PREMIUM</span>
          <h1 style={heroTitle}>APONA <span style={{ color: "#ff1f1f" }}>MOTORS</span></h1>
          <p style={heroSubtitle}>Siente el pulso de la ingeniería de élite.</p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" }}>
            <button style={btnPrincipal} onClick={() => navigate("/alto-cc")}>EXPLORAR ALTO CC</button>
            <button style={btnSecundario} onClick={() => navigate("/adventure")}>MUNDO ADVENTURE</button>
          </div>
        </motion.div>
      </section>

      <section style={{ padding: "60px 20px", background: darkMode ? "#111" : "#f9f9f9" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "30px", maxWidth: "1000px", margin: "auto", textAlign: "center" }}>
          <div><h2 style={{ fontSize: "40px", color: "#ff1f1f" }}>+500</h2><p style={{fontWeight: "bold"}}>Motos Entregadas</p></div>
          <div><h2 style={{ fontSize: "40px", color: "#ff1f1f" }}>12</h2><p style={{fontWeight: "bold"}}>Marcas Globales</p></div>
          <div><h2 style={{ fontSize: "40px", color: "#ff1f1f" }}>100%</h2><p style={{fontWeight: "bold"}}>Garantía Apona</p></div>
        </div>
      </section>

      <section style={{ maxWidth: "1200px", margin: "40px auto 80px", padding: "0 20px" }}>
        <div style={gridTop}>
          {[
            { icon: "🏁", title: "Racing Series", desc: "Adrenalina pura.", path: "/alto-cc" },
            { icon: "🏞️", title: "Adventure", desc: "Domina el terreno.", path: "/adventure", special: true },
            { icon: "💎", title: "Exclusividad", desc: "Atención única.", path: "/contact" }
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} style={{ ...cardVivid, background: item.special ? "linear-gradient(135deg, #1a1a1a 0%, #333 100%)" : theme.card, color: item.special ? "white" : theme.text }} onClick={() => navigate(item.path)}>
              <div style={iconCircle}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p style={{ opacity: 0.7 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <FadeIn>
        <section style={{ maxWidth: "1200px", margin: "100px auto", padding: "0 20px", textAlign: "center" }}>
          <h2 style={sectionTitle}>EXPERIENCIAS APONA</h2>
          <div style={grid}>
            <Testimonio nombre="Carlos Ruiz" moto="Ducati V4" texto="La mejor atención de Bogotá. Nicolás me asesoró en todo el proceso." />
            <Testimonio nombre="Elena Peña" moto="BMW GS 1300" texto="Increíble servicio post-venta. Mi moto siempre está a punto." />
            <Testimonio nombre="Julian Sosa" moto="Kawasaki H2R" texto="Puntualidad y máquinas en perfecto estado." />
          </div>
        </section>
      </FadeIn>

      <section style={{ ...formSection, background: theme.formBg }}>
        <FadeIn>
          <div style={{ ...formCard, background: theme.card, color: theme.text }}>
            <h2 style={{ fontSize: "32px", fontWeight: "900" }}>AGENDAR CITA</h2>
            {enviado ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={successMessage}>✅ ¡Cita registrada!</motion.div>
            ) : (
              <form onSubmit={handleCita} style={formGrid}>
                <input type="text" placeholder="Nombre" style={{...inputStyle, background: theme.bg, color: theme.text}} required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                <input type="tel" placeholder="Teléfono" style={{...inputStyle, background: theme.bg, color: theme.text}} required value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
                <select style={{...inputStyle, background: theme.bg, color: theme.text}} required value={formData.motivo} onChange={(e) => setFormData({...formData, motivo: e.target.value})}>
                  <option value="">¿Qué quieres agendar?</option>
                  <option value="Compra">Compra</option>
                  <option value="TestDrive">Test Drive</option>
                </select>
                <button type="submit" style={btnPrincipal}>REGISTRAR</button>
              </form>
            )}
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

function Testimonio({ nombre, moto, texto }) {
  return (
    <div style={{ padding: "30px", borderRadius: "20px", border: "1px solid #eee", textAlign: "left" }}>
      <p style={{ fontStyle: "italic", marginBottom: "15px" }}>"{texto}"</p>
      <h4>{nombre}</h4>
      <span style={{ color: "#ff1f1f", fontSize: "12px", fontWeight: "bold" }}>{moto}</span>
    </div>
  );
}

/* ================= CATÁLOGO ================= */

function CatalogoBase({ titulo, motos, darkMode, onSelectMoto }) {
  const [filtro, setFiltro] = useState("Todas");
  const theme = darkMode ? darkTheme : lightTheme;
  const marcas = ["Todas", ...new Set(motos.map(m => m.nombre.split(' ')[0]))];
  const motosFiltradas = filtro === "Todas" ? motos : motos.filter(m => m.nombre.startsWith(filtro));

  return (
    <div style={{ padding: "120px 20px 40px", maxWidth: "1200px", margin: "auto", minHeight: "100vh", color: theme.text }}>
      <FadeIn>
        <h1 style={{ fontSize: "42px", fontWeight: "900", textAlign: "center" }}>{titulo}</h1>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
          {marcas.map(marca => (
            <button key={marca} onClick={() => setFiltro(marca)} style={{...btnFiltro, background: filtro === marca ? "#ff1f1f" : "transparent", color: filtro === marca ? "white" : (darkMode ? "white" : "black") }}>{marca}</button>
          ))}
        </div>
      </FadeIn>
      <div style={grid}>
        {motosFiltradas.map((moto) => (
          <motion.div key={moto.nombre} layout style={{ ...cardCatalog, background: theme.card }} whileHover={{ y: -10 }}>
            <div style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}>
              <img src={moto.img} alt={moto.nombre} style={imgCatalog} />
              <div style={priceTag}>USD {moto.usd}</div>
            </div>
            <h2 style={{ fontSize: "20px", marginTop: "15px" }}>{moto.nombre}</h2>
            <p style={{ color: "#ff1f1f", fontWeight: "bold" }}>{moto.cat}</p>
            <p style={{ opacity: 0.6, fontSize: "13px" }}>Aprox: ${moto.cop} COP</p>
            <button onClick={() => onSelectMoto(moto)} style={{ ...btnPrincipal, width: "100%", marginTop: "15px" }}>COTIZAR / FINANCIAR</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ================= CONTACT & FOOTER ================= */

function Contact() {
    return (
      <div style={{ maxWidth: "800px", margin: "120px auto", padding: "40px", textAlign: "center", background: "#f9f9f9", borderRadius: "30px" }}>
        <h1 style={{ color: "#111", fontSize: "48px", fontWeight: "900" }}>¡HABLEMOS!</h1>
        <div style={contactGrid}>
          <div style={contactBox}>📧<br/>aponamotors@gmail.com</div>
          <div style={contactBox}>📍<br/>Bogotá, Colombia</div>
          <div style={{...contactBox, background: "#ff1f1f", color: "white"}}>📞<br/>316 724 4892</div>
        </div>
      </div>
    );
}

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px" }}>
        <div><h3 style={{ fontSize: "24px", fontWeight: "900" }}>APONA<span style={{ color: "#ff1f1f" }}>MOTORS</span></h3><p style={{ opacity: 0.7 }}>Distribuidor líder en Colombia.</p></div>
        <div><h4 style={{ fontWeight: "800" }}>CONTACTO</h4><p style={{ fontSize: "14px" }}>Bogotá | +57 316 724 4892</p></div>
      </div>
    </footer>
  );
}

/* ================= APP PRINCIPAL ================= */

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMoto, setSelectedMoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCheckout = (moto) => { setSelectedMoto(moto); setIsModalOpen(true); };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <div style={{ minHeight: "100vh", background: darkMode ? "#000" : "#fff", transition: "0.3s", fontFamily: "sans-serif" }}>
        <nav style={{ ...navbarStyle, background: darkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)", color: darkMode ? "white" : "black" }}>
          <div style={{ fontWeight: "900", fontSize: "24px" }}>APONA<span style={{ color: "#ff1f1f" }}>MOTORS</span></div>
          <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
            <Link to="/" style={{ ...navLink, color: darkMode ? "white" : "black" }}>INICIO</Link>
            <Link to="/alto-cc" style={{ ...navLink, color: darkMode ? "white" : "black" }}>ALTO CC</Link>
            <Link to="/adventure" style={{ ...navLink, color: darkMode ? "white" : "black" }}>ADVENTURE</Link>
            <Link to="/contact" style={{ ...navLink, color: "#ff1f1f" }}>CONTACTO</Link>
            <button onClick={() => setDarkMode(!darkMode)} style={btnTheme}>{darkMode ? "☀️" : "🌙"}</button>
          </div>
        </nav>

        <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} moto={selectedMoto} darkMode={darkMode} />

        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/alto-cc" element={<CatalogoBase titulo="ALTO CILINDRAJE" darkMode={darkMode} motos={motosRacing} onSelectMoto={openCheckout} />} />
          <Route path="/adventure" element={<CatalogoBase titulo="MUNDO ADVENTURE" darkMode={darkMode} motos={motosAdventure} onSelectMoto={openCheckout} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

/* ================= DATA ================= */

const motosRacing = [
    { nombre: "BMW S1000RR", img: "https://images.unsplash.com/photo-1635073908681-b4dfbd6015e8?fm=jpg&q=60&w=3000&auto=format&fit=crop", cat: "Deportiva", usd: "25,500", cop: "102'000.000" },
    { nombre: "BMW M 1000 RR", img: "https://www.motofichas.com/images/articulos/bmw/m-1000-rr-2025/bmw-m-1000-rr-2025-01.jpg", cat: "Deportiva", usd: "38,000", cop: "152'000.000" },
    { nombre: "Kawasaki ZX-10R", img: "https://a.mcdn.es/mnet/contents/media/resources/2020/11/1167914.jpg/900x505cut/5", cat: "Deportiva", usd: "19,500", cop: "78'000.000" },
    { nombre: "Kawasaki H2R", img: "https://antre-du-motard.com/cdn/shop/articles/kawasaki_h2r_1200x1200.webp?v=1725873104", cat: "Deportiva", usd: "58,000", cop: "232'000.000" },
    { nombre: "Ducati Panigale V4", img: "https://dlgmotoart.com/cdn/shop/files/PANV4S_a.jpg?v=1757444363", cat: "Deportiva", usd: "32,900", cop: "131'600.000" },
    { nombre: "Ducati Streetfighter V4", img: "https://ducatidetroit.com/wp-content/uploads/2025/06/IMG_5704.jpg", cat: "Deportiva", usd: "28,500", cop: "114'000.000" },
    { nombre: "Aprilia RSV4", img: "https://apriliamx.com/wp-content/uploads/sites/3/2025/10/imgi_8_aprilia_rsv4-wall-image-1920x1440-1.jpg", cat: "Deportiva", usd: "26,800", cop: "107'200.000" },
    { nombre: "Yamaha R1", img: "https://www.yamahamotos.cl/wp-content/uploads/2016/09/r1_negra.jpg", cat: "Deportiva", usd: "18,900", cop: "75'600.000" },
    { nombre: "Yamaha R6", img: "https://images.unsplash.com/photo-1660725997223-efbedf3397fb?fm=jpg&q=60&w=3000&auto=format&fit=crop", cat: "Deportiva", usd: "13,500", cop: "54'000.000" },
    { nombre: "Suzuki GSX-R1000", img: "https://imgcdn.zigwheels.ph/medium/gallery/exterior/83/3314/suzuki-gsx-r1000r-21899.jpg", cat: "Deportiva", usd: "17,200", cop: "68'800.000" },
    { nombre: "Honda CBR1000RR", img: "https://i.blogs.es/24a60c/honda-cbr1000rr-r-sp-fireblade-2020-014/840_560.jpg", cat: "Deportiva", usd: "29,400", cop: "117'600.000" }
];

const motosAdventure = [
    { nombre: "BMW R 1300 GS", img: "https://mediapool.bmwgroup.com/cache/P9/202406/P90557533/P90557533-bmw-r-1300-gs-adventure-07-2024-600px.jpg", cat: "Adventure", usd: "23,800", cop: "95'200.000" },
    { nombre: "Ducati Multistrada V4", img: "https://www.cyclenews.com/wp-content/uploads/2024/06/2024-Ducati-Multistrada-V4-RS.jpg", cat: "Adventure", usd: "30,500", cop: "122'000.000" },
    { nombre: "Kawasaki Versys 1000", img: "https://www.motofichas.com/images/phocagallery/Kawasaki/versys-1000-2023/01-kawasaki-versys-1000-2023-estudio-negro.jpg", cat: "Adventure", usd: "15,800", cop: "63'200.000" },
    { nombre: "BMW F 850 GS", img: "https://www.moto1pro.com/sites/default/files/bmw-f-850-gs-adventure-2019.jpg", cat: "Adventure", usd: "16,500", cop: "66'000.000" },
    { nombre: "Kawasaki KLR 650", img: "https://www.moto1pro.com/sites/default/files/kawasakiklr650-2021-011.jpg", cat: "Adventure", usd: "7,500", cop: "30'000.000" }
];

/* ================= ESTILOS ================= */

const lightTheme = { bg: "#fff", text: "#111", card: "#fff", formBg: "#f3f4f6" };
const darkTheme = { bg: "#0a0a0a", text: "#fff", card: "#1a1a1a", formBg: "#111" };
const navbarStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5%", position: "fixed", top: 0, width: "90%", left: "5%", zIndex: 1000, backdropFilter: "blur(10px)", borderRadius: "0 0 15px 15px" };
const navLink = { textDecoration: "none", fontWeight: "800", fontSize: "13px" };
const heroSection = { position: "relative", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "url('https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070')", backgroundSize: "cover", backgroundPosition: "center", color: "white" };
const heroOverlay = { position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" };
const heroContent = { position: "relative", zIndex: 1, textAlign: "center" };
const heroBadge = { background: "#ff1f1f", padding: "5px 15px", fontSize: "12px", fontWeight: "bold", borderRadius: "20px" };
const heroTitle = { fontSize: "clamp(40px, 8vw, 80px)", fontWeight: "900", margin: "10px 0" };
const heroSubtitle = { fontSize: "18px", opacity: 0.8 };
const btnPrincipal = { background: "#ff1f1f", color: "white", border: "none", padding: "15px 30px", borderRadius: "10px", fontWeight: "900", cursor: "pointer" };
const btnSecundario = { background: "rgba(255,255,255,0.1)", color: "white", border: "2px solid white", padding: "15px 30px", borderRadius: "10px", fontWeight: "900", cursor: "pointer" };
const gridTop = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" };
const cardVivid = { padding: "40px", borderRadius: "25px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", cursor: "pointer" };
const iconCircle = { fontSize: "24px", marginBottom: "15px", width: "50px", height: "50px", background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" };
const sectionTitle = { fontSize: "36px", fontWeight: "900" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" };
const btnTheme = { background: "none", border: "none", fontSize: "20px", cursor: "pointer" };
const formSection = { padding: "100px 20px" };
const formCard = { maxWidth: "600px", margin: "auto", padding: "50px", borderRadius: "30px", textAlign: "center" };
const formGrid = { display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" };
const inputStyle = { padding: "15px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "16px" };
const successMessage = { background: "#dcfce7", color: "#166534", padding: "20px", borderRadius: "15px", fontWeight: "bold" };
const cardCatalog = { padding: "20px", borderRadius: "20px", border: "1px solid #eee", textAlign: "center", position: "relative" };
const imgCatalog = { width: "100%", height: "250px", objectFit: "cover", borderRadius: "12px" };
const priceTag = { position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.8)", color: "white", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" };
const contactGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" };
const contactBox = { padding: "20px", background: "white", borderRadius: "15px", fontWeight: "bold", color: "#000" };
const footerStyle = { background: "#000", color: "white", padding: "80px 5% 40px", marginTop: "auto" };
const whatsappFloat = { position: "fixed", bottom: "30px", right: "30px", background: "#25d366", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1001 };
const btnFiltro = { padding: "8px 20px", borderRadius: "20px", border: "2px solid #ff1f1f", cursor: "pointer", fontWeight: "bold" };
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };
const modalStyle = { width: "100%", maxWidth: "500px", padding: "40px", borderRadius: "30px", position: "relative" };
const btnClose = { position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "24px", cursor: "pointer" };
const gridMetodos = { display: "flex", flexDirection: "column", gap: "12px", marginTop: "25px" };
const btnMetodo = { padding: "18px", borderRadius: "15px", border: "1px solid #ff1f1f", background: "transparent", color: "inherit", cursor: "pointer", fontWeight: "900" };

export default App;