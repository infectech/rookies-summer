import { cn } from "@/lib/utils";

interface ProductDescriptionProps {
  description: string;
  className?: string;
}

/** Groups a description's markdown-ish lines into sections split on "### "
 * headings, so a specific section (e.g. "Why should you buy from us?") can
 * get its own styling instead of blending into the rest of the text. */
function splitIntoSections(description: string) {
  const lines = description.split("\n");
  const sections: { heading: string | null; lines: string[] }[] = [];

  for (const line of lines) {
    if (line.startsWith("### ")) {
      sections.push({ heading: line.replace("### ", ""), lines: [] });
      continue;
    }
    if (sections.length === 0) sections.push({ heading: null, lines: [] });
    sections[sections.length - 1].lines.push(line);
  }

  return sections;
}

function renderLines(lines: string[]) {
  return lines.map((line, i) => {
    if (line.startsWith("- ")) {
      return (
        <ul key={i} className="list-disc pl-5">
          <li>{line.replace("- ", "")}</li>
        </ul>
      );
    }
    if (line.startsWith("*") && line.endsWith("*")) {
      return (
        <p key={i} className="mt-2 text-xs italic">
          {line.replaceAll("*", "")}
        </p>
      );
    }
    if (line.trim() === "") return null;
    return (
      <p key={i} className="mt-1">
        {line}
      </p>
    );
  });
}

export default function ProductDescription({
  description,
  className,
}: ProductDescriptionProps) {
  const sections = splitIntoSections(description);

  return (
    <div className={cn("text-sm leading-relaxed text-muted-foreground", className)}>
      {sections.map((section, i) => {
        const isWhyBuy = section.heading?.toLowerCase().includes("why should you buy");

        if (isWhyBuy) {
          return (
            <div
              key={i}
              className="mt-4 mb-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 first:mt-0"
            >
              <h3 className="mb-2 font-semibold text-emerald-800">{section.heading}</h3>
              <div className="[&_ul]:marker:text-emerald-500">{renderLines(section.lines)}</div>
            </div>
          );
        }

        return (
          <div key={i}>
            {section.heading && (
              <h3 className="mt-4 mb-2 font-semibold text-black first:mt-0">
                {section.heading}
              </h3>
            )}
            {renderLines(section.lines)}
          </div>
        );
      })}
    </div>
  );
}
