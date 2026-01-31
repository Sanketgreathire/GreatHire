export default function Hero() {
  return (
    <div className="container-hero ">
      <div className="image-box">
        <img src="/bannerImage2.png" alt="hero" />
      </div>

      <div className="content-right">
        <h1 className="hero-heading">
          Great<span style={{ color: "#2563eb" }}>Hire</span> Insights - The Future of Work
        </h1>

        <p className="hero-content">
         "Your all-in-one platform for job applications and recruitment—connecting talent with opportunity and allowing professionals to grab new possibilities in a dynamic workplace."
        </p>

        <i style={{ color: "#828890", fontWeight: 600 }}>-GreatHire</i>
      </div>
    </div>
  );
}

