export default function Insights() {
  return (
    <section className="insights-section">
      <h2>Industry Insights</h2>
      <p className="section-desc">
        Quick advice to help you develop, get ready, and succeed
      </p>
      

      <div className="custom-container">
        <div className="slider-mask">
          <div className="slider-wrapper">
            <div className="slider">
                {[
                  { title: "Career Advice" },
                  { title: "Hiring Advice" },
                  { title: "Resume Tips" },
                  { title: "HR Insights" },
                  { title: "Trending Topics" }
                ].map((item, i) => (
                  <div className="insight-card" key={i}>
                    <div className="insight-card-content">
                      <h5>{item.title}</h5>
                      <p>Expert advice selected for you.</p>
                    </div>
                    <div className="insight-card-image">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                        alt={item.title}
                        style={{ width: "60px", height: "60px" }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
