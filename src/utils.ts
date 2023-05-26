export const capitalize = (text: string) => {
  if (text?.trim()?.length === 0) return '';

  const firstChar = text.charAt(0).toUpperCase();
  return firstChar.concat(text.slice(1));
};
