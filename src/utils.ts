export const capitalize = (text: string) => {
  if (text?.trim()?.length === 0) return '';

  const firstChar = text.charAt(0).toUpperCase();
  return firstChar.concat(text.slice(1));
};

export const renderLogoFromBase64 = (logo: string) => {
  if (!logo) return '';
  return `data:image/png;base64, ${logo}`;
};
