import { useState } from "react";

type Categoria = {
  label: string;
  cor: string;
};

function classificarIMC(imc: number): Categoria {
  if (imc < 18.5) return { label: "Abaixo do peso", cor: "#3b82f6" };
  if (imc < 25)   return { label: "Peso normal", cor: "#22c55e" };
  if (imc < 30)   return { label: "Sobrepeso", cor: "#f59e0b" };
  if (imc < 35)   return { label: "Obesidade grau I", cor: "#f97316" };
  if (imc < 40)   return { label: "Obesidade grau II", cor: "#ef4444" };
  return            { label: "Obesidade grau III", cor: "#991b1b" };
}

export default function App() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState<{ imc: number; categoria: Categoria } | null>(null);
  const [erro, setErro] = useState("");

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setResultado(null);

    const p = parseFloat(peso.replace(",", "."));
    const a = parseFloat(altura.replace(",", "."));

    if (isNaN(p) || isNaN(a) || p <= 0 || a <= 0) {
      setErro("Insira valores válidos para peso e altura.");
      return;
    }
    if (p > 500) { setErro("Peso inválido."); return; }
    if (a > 3)   { setErro("Altura inválida. Use metros (ex: 1.75)."); return; }

    const imc = p / (a * a);
    setResultado({ imc, categoria: classificarIMC(imc) });
  }

  function limpar() {
    setPeso("");
    setAltura("");
    setResultado(null);
    setErro("");
  }

  const barraIMC = resultado ? Math.min(Math.max(((resultado.imc - 10) / 40) * 100, 0), 100) : 0;

  return (
    <div className="pagina">
      <div className="cartao">
        <h1 className="titulo">Calculadora de IMC</h1>
        <p className="subtitulo">Índice de Massa Corporal</p>

        <form onSubmit={calcular} className="formulario">
          <div className="campo">
            <label htmlFor="peso">Peso (kg)</label>
            <input
              id="peso"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 70"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="campo">
            <label htmlFor="altura">Altura (m)</label>
            <input
              id="altura"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 1.75"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              autoComplete="off"
            />
          </div>

          {erro && <p className="erro">{erro}</p>}

          <div className="botoes">
            <button type="submit" className="btn-calcular">Calcular</button>
            {resultado && (
              <button type="button" className="btn-limpar" onClick={limpar}>Limpar</button>
            )}
          </div>
        </form>

        {resultado && (
          <div className="resultado">
            <div className="imc-valor" style={{ color: resultado.categoria.cor }}>
              {resultado.imc.toFixed(1)}
            </div>
            <div className="imc-label">
              <span className="badge" style={{ background: resultado.categoria.cor }}>
                {resultado.categoria.label}
              </span>
            </div>

            <div className="barra-container">
              <div className="barra-track">
                <div className="barra-fill" style={{ width: `${barraIMC}%`, background: resultado.categoria.cor }} />
                <div className="barra-indicador" style={{ left: `${barraIMC}%` }} />
              </div>
              <div className="barra-labels">
                <span>Baixo</span>
                <span>Normal</span>
                <span>Sobrepeso</span>
                <span>Obesidade</span>
              </div>
            </div>
          </div>
        )}

        <div className="tabela">
          <h2>Tabela de referência</h2>
          <table>
            <thead>
              <tr>
                <th>IMC</th>
                <th>Classificação</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: "Menos de 18,5", label: "Abaixo do peso", cor: "#3b82f6" },
                { range: "18,5 – 24,9",   label: "Peso normal",     cor: "#22c55e" },
                { range: "25,0 – 29,9",   label: "Sobrepeso",       cor: "#f59e0b" },
                { range: "30,0 – 34,9",   label: "Obesidade I",     cor: "#f97316" },
                { range: "35,0 – 39,9",   label: "Obesidade II",    cor: "#ef4444" },
                { range: "40,0 ou mais",  label: "Obesidade III",   cor: "#991b1b" },
              ].map((row) => (
                <tr key={row.range}>
                  <td>{row.range}</td>
                  <td>
                    <span className="dot" style={{ background: row.cor }} />
                    {row.label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
