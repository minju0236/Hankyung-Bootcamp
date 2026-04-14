function SummaryCard(props) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{props.label}</div>
      <div style={styles.value}>{props.value}</div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '20px'
  },
  label: {
    color: '#6b7280',
    marginBottom: '8px'
  },
  value: {
    fontSize: '28px',
    fontWeight: 'bold'
  }
};

export default SummaryCard;