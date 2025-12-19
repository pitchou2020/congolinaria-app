export function converterDecimalParaFracao(numero) {
  const inteiro = Math.floor(numero);
  const decimal = +(numero - inteiro).toFixed(2);

  const mapa = {
    0.25: "¼",
    0.33: "⅓",
    0.5: "½",
    0.66: "⅔",
    0.75: "¾",
  };

  if (mapa[decimal]) {
    return inteiro === 0
      ? mapa[decimal]
      : `${inteiro}${mapa[decimal]}`;
  }

  return Number.isInteger(numero)
    ? numero.toString()
    : numero.toFixed(2);
}
