import LiquidEther from '../components/LiquidEther';

export default function Dashboard() {
  return (
    <section className="page-with-bg">
      <div className="bg-overlay">
        <LiquidEther
          colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <div className="bg-content">
        <h2>Dashboard</h2>
        <div className="card">
          <p>Welcome to Mealwar — reduce waste and share food locally.</p>
        </div>
      </div>
    </section>
  );
}
