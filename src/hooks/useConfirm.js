export function useConfirm() {
  return (message = 'Are you sure?', onYes) => {
    if (window.confirm(message)) onYes();
  };
}
export default useConfirm;