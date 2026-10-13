import "./GreatHireIntro.css";

export default function GreatHireIntro() {
  return (
    <div className="gh-intro" role="status" aria-label="GreatHire">
      <div className="gh-intro__stage" aria-hidden="true">
        <span className="gh-intro__orb gh-intro__orb--a" />
        <span className="gh-intro__orb gh-intro__orb--b" />
        <span className="gh-intro__bubble gh-intro__bubble--one" />
        <span className="gh-intro__bubble gh-intro__bubble--two" />
        <span className="gh-intro__bubble gh-intro__bubble--three" />
        <span className="gh-intro__bubble gh-intro__bubble--four" />
        <span className="gh-intro__bubble gh-intro__bubble--five" />
        <span className="gh-intro__axis" />
      </div>

      <div className="gh-intro__core">
        <div className="gh-intro__mark" aria-hidden="true">
          <span className="gh-intro__slice gh-intro__slice--g" />
          <span className="gh-intro__slice gh-intro__slice--h" />
          <span className="gh-intro__sheen" />
        </div>

        <p className="gh-intro__name">
          Great<span>Hire</span>
        </p>

        <span className="gh-intro__rule" />

        <p className="gh-intro__tag">Find job or Hire Staff</p>

        <ul className="gh-intro__pillars">
          <li>Smarter</li>
          <li>Faster</li>
          <li>Risk free</li>
        </ul>
      </div>
    </div>
  );
}
