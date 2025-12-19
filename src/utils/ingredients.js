import { converterDecimalParaFracao } from "./fractions";

export function ajustarIngredientes(texto, fator) {
  if (!texto) return "";

  return texto
    .split("\n")
    .map((linha) => {
      const match = linha.match(/^([\d./]+)\s*(.*)$/);
      if (!match) return linha;

      let valor = match[1];
      if (valor.includes("/")) {
        const [n, d] = valor.split("/").map(Number);
        valor = n / d;
      } else {
        valor = parseFloat(valor);
      }

      if (isNaN(valor)) return linha;

      return `${converterDecimalParaFracao(valor * fator)} ${match[2]}`;
    })
    .join("\n");
}
