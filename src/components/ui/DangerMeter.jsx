export default function DangerMeter({ value }) {
  return (
    <div className="box">
      Danger Level: {value}%
      <div className="bar">
        <div className="fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
