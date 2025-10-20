export function useDate() {
  const format = (d) => {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
    } catch { return d; }
  };
  return { format };
}
export default useDate;