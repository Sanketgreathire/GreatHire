import { useRef } from "react";

export default function BlogSection() {
  const blogCards = useRef(null);

  const scroll = (dir) => {
    const card = blogCards.current.querySelector(".blog-card");
    const gap = 25;
    blogCards.current.scrollLeft += dir * (card.offsetWidth + gap);
  };

  return (
    <section className="blog-section">
      <div className="blog-header">
        <div>
          <h2>Our Recent Articles</h2>
          <p>Keep Up with Our Most Recent Findings</p>
        </div>

        <div className="nav-buttons">
          <button onClick={() => scroll(-1)}>&larr;</button>
          <button onClick={() => scroll(1)}>&rarr;</button>
        </div>
      </div>

      <div className="blog-cards" ref={blogCards}>
        {[
          {
            img: "https://images.unsplash.com/photo-1587614382346-ac9a5f3efb3f",
            title: "Beyond Transactions: POS System",
            author: "Sam Pitak",
          },
          {
            img: "https://images.unsplash.com/photo-1556741533-f6acd647d2fb",
            title: "From Store to Online",
            author: "Yuli Sumpil",
          },
          {
            img: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9",
            title: "Security First",
            author: "Ambon Fanda",
          },
          {
            img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            title: "Smart Analytics",
            author: "John Doe",
          },
        ].map((b, i) => (
          <div className="blog-card" key={i}>
            <img src={b.img} />
            <div className="card-content">
              <div className="meta">
                <span className="author">{b.author}</span>
                <span className="date">20 Apr 2024</span>
              </div>
              <h3>{b.title}</h3>
              <p>These days, POS systems are much more than just payment processors.</p>
              <a href="#">Read More →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
