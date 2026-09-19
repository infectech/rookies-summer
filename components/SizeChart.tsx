import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SIZE_CHART, TROUSER_SIZE_CHART } from "@/lib/config";

interface SizeChartProps {
  variant?: "shirt" | "trouser";
}

export default function SizeChart({ variant = "shirt" }: SizeChartProps) {
  return (
    <Accordion defaultValue={["size-chart"]}>
      <AccordionItem value="size-chart">
        <AccordionTrigger className="text-sm">Size Chart</AccordionTrigger>
        <AccordionContent>
          {variant === "trouser" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Waist (in)</TableHead>
                  <TableHead>Hip (in)</TableHead>
                  <TableHead>Leg Opening (in)</TableHead>
                  <TableHead>Length (in)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TROUSER_SIZE_CHART.map((row) => (
                  <TableRow key={row.size}>
                    <TableCell className="font-medium">{row.size}</TableCell>
                    <TableCell>{row.waist}</TableCell>
                    <TableCell>{row.hip}</TableCell>
                    <TableCell>{row.legOpening}</TableCell>
                    <TableCell>{row.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Chest (in)</TableHead>
                  <TableHead>Length (in)</TableHead>
                  <TableHead>Sleeve (in)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SIZE_CHART.map((row) => (
                  <TableRow key={row.size}>
                    <TableCell className="font-medium">{row.size}</TableCell>
                    <TableCell>{row.chest}</TableCell>
                    <TableCell>{row.length}</TableCell>
                    <TableCell>{row.sleeve}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            All measurements are in inches. Expected deviation &lt; 3%.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
