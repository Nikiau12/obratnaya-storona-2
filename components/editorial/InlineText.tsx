import { Fragment, type ReactNode } from "react";

export function InlineText({ text }: { text: string }) {
  const clean = text.replace(/\\([\\`*_{}\[\]()#+\-.!>])/g, "$1");
  const pattern = /\[\^(\d+)\]|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const nodes: ReactNode[] = [];
  let start = 0;
  for (const match of clean.matchAll(pattern)) {
    nodes.push(clean.slice(start, match.index));
    if (match[1]) nodes.push(<sup key={match.index} id={`note-ref-${match[1]}`}><a href={`#note-${match[1]}`} role="doc-noteref" aria-label={`Сноска ${match[1]}`}>{match[1]}</a></sup>);
    else if (match[2]) nodes.push(<strong key={match.index}>{match[2]}</strong>);
    else nodes.push(<em key={match.index}>{match[3]}</em>);
    start = match.index! + match[0].length;
  }
  nodes.push(clean.slice(start));
  return <>{nodes.map((node, index) => <Fragment key={index}>{node}</Fragment>)}</>;
}
