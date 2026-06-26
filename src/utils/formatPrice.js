export const formatCOP = (amount) => {
  const value = Number(amount);
  if (Number.isNaN(value)) return '$0';
  return `$${value.toLocaleString('es-CO')}`;
};

export const parseCOPInput = (value) => {
  const digits = String(value).replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
};
