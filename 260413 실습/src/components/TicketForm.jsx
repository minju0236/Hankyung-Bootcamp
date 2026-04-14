function TicketForm(props) {
  return (
    <div style={styles.box}>
      <h2 style={styles.title}>{props.editId ? '문의 수정' : '문의 등록'}</h2>

      <input
        type="text"
        placeholder="고객명"
        value={props.form.customer_name}
        onChange={function (e) {
          props.setForm({
            ...props.form,
            customer_name: e.target.value
          });
        }}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="문의 제목"
        value={props.form.title}
        onChange={function (e) {
          props.setForm({
            ...props.form,
            title: e.target.value
          });
        }}
        style={styles.input}
      />

      <select
        value={props.form.status}
        onChange={function (e) {
          props.setForm({
            ...props.form,
            status: e.target.value
          });
        }}
        style={styles.input}
      >
        <option value="접수대기">접수대기</option>
        <option value="처리중">처리중</option>
        <option value="처리완료">처리완료</option>
      </select>

      <textarea
        placeholder="문의 내용"
        value={props.form.content}
        onChange={function (e) {
          props.setForm({
            ...props.form,
            content: e.target.value
          });
        }}
        style={styles.textarea}
      />

      <div style={styles.buttonRow}>
        <button onClick={props.onSubmit} style={styles.submitButton}>
          {props.editId ? '수정 저장' : '등록'}
        </button>

        <button onClick={props.onReset} style={styles.resetButton}>
          초기화
        </button>
      </div>
    </div>
  );
}

const styles = {
  box: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px'
  },
  title: {
    marginBottom: '16px'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    boxSizing: 'border-box'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px'
  },
  submitButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#111827',
    color: '#ffffff',
    cursor: 'pointer'
  },
  resetButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#9ca3af',
    color: '#ffffff',
    cursor: 'pointer'
  }
};

export default TicketForm;