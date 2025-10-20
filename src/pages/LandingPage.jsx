import React from "react";

export default function LandingPage({ onNavigate }) {
  const imgUrl = `${import.meta.env.BASE_URL}images/image.png`;
  return (
    <div className="snap-container">
      <section className="snap-section">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h1 className="fw-bold mb-3" style={{ color: "var(--taupe-dark)" }}>
                Premium Salon Services
              </h1>
              <p className="lead mb-4">
                Book appointments easily. Enjoy expert hair care, coloring, and spa treatments.
              </p>
              <div className="d-flex gap-3">
                <button className="btn btn-primary px-4" onClick={() => onNavigate("register")}>
                  Get Started
                </button>
                <button className="btn btn-outline-primary px-4" onClick={() => onNavigate("login")}>
                  Login
                </button>
              </div>
              <div className="text-muted small mt-2">Scroll down for more information</div>
            </div>
            <div className="col-lg-6">
              <img src={imgUrl} alt="Salon" className="hero-img rounded shadow" />
            </div>
          </div>
        </div>
      </section>

      <section className="snap-section" style={{ backgroundColor: "#fff" }}>
        <div className="container py-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6 text-start">
              <h2 className="mb-3">About Us</h2>
              <p>
                We’re a friendly neighborhood salon offering professional services—from
                classic haircuts to premium treatments—focused on comfort and quality.
              </p>
              <p className="mb-0">
                Our mission is to make you feel confident and refreshed with every visit.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="card shadow-sm text-center p-3 h-100">
                    <i className="bi bi-scissors fs-2 text-primary"></i>
                    <div className="mt-2 fw-semibold">Expert Stylists</div>
                    <small className="text-muted">Skilled and caring</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card shadow-sm text-center p-3 h-100">
                    <i className="bi bi-balloon-heart-fill fs-2 text-danger"></i>
                    <div className="mt-2 fw-semibold">Relaxing Care</div>
                    <small className="text-muted">Feel-good experience</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card shadow-sm text-center p-3 h-100">
                    <i className="bi bi-brush fs-2 text-primary"></i>
                    <div className="mt-2 fw-semibold">Color & Styling</div>
                    <small className="text-muted">Personalized looks</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card shadow-sm text-center p-3 h-100">
                    <i className="bi bi-spa fs-2 text-success"></i>
                    <div className="mt-2 fw-semibold">Spa & Treatment</div>
                    <small className="text-muted">Relax & rejuvenate</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="snap-section" style={{ backgroundColor: "#fafafa" }}>
        <div className="container py-4">
          <h2 className="mb-4">What Customers Say</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person-circle fs-4 me-2"></i>
                    <strong>@ana_styles</strong>
                  </div>
                  <p className="mb-2">"Sobrang ganda ng haircut!"</p>
                  <div className="text-warning">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person-circle fs-4 me-2"></i>
                    <strong>@jm_care</strong>
                  </div>
                  <p className="mb-2">"Mabilis ang service at very friendly ang staff."</p>
                  <div>
                    <i className="bi bi-hand-thumbs-up-fill text-primary me-2"></i>
                    <small>128 likes</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person-circle fs-4 me-2"></i>
                    <strong>@mika_glow</strong>
                  </div>
                  <p className="mb-2">"Ang ganda ng color at treatment. Will book again!"</p>
                  <div className="text-warning">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="snap-section">
        <div className="container py-4">
          <h2 className="mb-4">Contact Us</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="d-flex align-items-start">
                <i className="bi bi-telephone-fill fs-3 text-primary me-3"></i>
                <div>
                  <div className="fw-semibold">Phone</div>
                  <div>+63 900 000 0000</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start">
                <i className="bi bi-envelope-fill fs-3 text-primary me-3"></i>
                <div>
                  <div className="fw-semibold">Email</div>
                  <div>hello@salon.com</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start">
                <i className="bi bi-geo-alt-fill fs-3 text-primary me-3"></i>
                <div>
                  <div className="fw-semibold">Location</div>
                  <div>Zone IV, Socorro, Oriental Mindoro</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
