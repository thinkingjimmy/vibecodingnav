/**
 * [INPUT]: 依赖含 **强调** 与 `等宽` 的短文案
 * [OUTPUT]: 对外提供不使用 HTML 的行内渲染
 * [POS]: src/components 的变更日志渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) return <span key={index} className="font-medium">{part.slice(2, -2)}</span>;
        if (part.startsWith("`") && part.endsWith("`")) return <span key={index} className="num">{part.slice(1, -1)}</span>;
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
