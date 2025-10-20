import { useState, useCallback } from 'react';
export function useForm(initial = {}) {
  const [values, setValues] = useState(initial);
  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  }, []);
  const reset = useCallback(() => setValues(initial), [initial]);
  return [values, setValues, onChange, reset];
}
export default useForm;