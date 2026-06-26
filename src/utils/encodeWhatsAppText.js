/** Codifica texto UTF-8 para enlaces de WhatsApp (evita problemas con emojis en wa.me) */
export const encodeWhatsAppText = (text) => {
  const bytes = new TextEncoder().encode(String(text));
  let encoded = '';
  for (let i = 0; i < bytes.length; i += 1) {
    encoded += `%${bytes[i].toString(16).padStart(2, '0')}`;
  }
  return encoded;
};
