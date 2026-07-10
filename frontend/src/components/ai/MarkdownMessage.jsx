import { Fragment } from 'react';
import { Link } from 'react-router-dom';

function InlineMarkdown({ text }) {
  const tokens = String(text).split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.map((token, index) => {
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && link[2].startsWith('/')) return <Link key={index} to={link[2]} className="font-semibold text-[var(--accent)] underline underline-offset-2">{link[1]}</Link>;
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="font-semibold text-[var(--accent)] underline underline-offset-2">{link[1]}</a>;
    if (token.startsWith('**') && token.endsWith('**')) return <strong key={index} className="font-semibold text-inherit">{token.slice(2, -2)}</strong>;
    if (token.startsWith('`') && token.endsWith('`')) return <code key={index} className="rounded bg-black/10 px-1 py-0.5 text-[0.9em] dark:bg-white/10">{token.slice(1, -1)}</code>;
    return <Fragment key={index}>{token}</Fragment>;
  });
}

export default function MarkdownMessage({ content }) {
  return <div className="space-y-2 text-sm leading-6">{String(content).split('\n').map((line, index) => {
    if (!line.trim()) return <div key={index} className="h-1" />;
    const heading = line.match(/^#{1,3}\s+(.+)/);
    if (heading) return <p key={index} className="font-bold text-inherit"><InlineMarkdown text={heading[1]} /></p>;
    const bullet = line.match(/^[-*]\s+(.+)/);
    if (bullet) return <div key={index} className="flex gap-2"><span aria-hidden="true">•</span><span><InlineMarkdown text={bullet[1]} /></span></div>;
    const numbered = line.match(/^(\d+)\.\s+(.+)/);
    if (numbered) return <div key={index} className="flex gap-2"><span>{numbered[1]}.</span><span><InlineMarkdown text={numbered[2]} /></span></div>;
    return <p key={index} className="text-inherit"><InlineMarkdown text={line} /></p>;
  })}</div>;
}
