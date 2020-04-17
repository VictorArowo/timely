export default (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};
