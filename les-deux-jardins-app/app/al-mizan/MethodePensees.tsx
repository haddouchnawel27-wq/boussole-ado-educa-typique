"use client";

// La méthode en 5 étapes — repère visuel au-dessus du journal des pensées.
const ETAPES = [
  { n: "1", titre: "Le fait exact", desc: "ce qui s'est passé, sans interprétation" },
  { n: "2", titre: "La pensée, mot pour mot", desc: "ce que ta tête s'est dit" },
  { n: "3", titre: "L'émotion + intensité", desc: "nomme-la, de 0 à 10" },
  { n: "4", titre: "Le comportement", desc: "ce que tu as fait ensuite" },
  { n: "5", titre: "La conséquence", desc: "et une lecture plus juste" },
];

export function MethodePensees() {
  return (
    <div className="amz-meth">
      <ul className="amz-meth-list">
        {ETAPES.map((e) => (
          <li key={e.n} className="amz-meth-etape">
            <span className="amz-meth-n" aria-hidden="true">{e.n}</span>
            <span className="amz-meth-body">
              <span className="amz-meth-t">{e.titre}</span>
              <span className="amz-meth-d">{e.desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
