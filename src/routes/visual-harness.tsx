import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Hidden visual-regression harness. Renders every interactive primitive in
// a stable, deterministic layout so the Playwright suite can screenshot
// each state and diff it against a stored baseline.
export const Route = createFileRoute("/visual-harness")({
  component: VisualHarness,
  head: () => ({ meta: [{ title: "Visual Harness" }] }),
});

function Row({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div data-vh-row={id} className="flex flex-col gap-2 p-4 border rounded-md bg-background">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function VisualHarness() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-4">
      <h1 className="text-2xl">Visual Harness</h1>

      <Row id="button-default" label="Button / default">
        <Button data-vh="btn-default">Default</Button>
      </Row>
      <Row id="button-outline" label="Button / outline">
        <Button data-vh="btn-outline" variant="outline">Outline</Button>
      </Row>
      <Row id="button-secondary" label="Button / secondary">
        <Button data-vh="btn-secondary" variant="secondary">Secondary</Button>
      </Row>
      <Row id="button-ghost" label="Button / ghost">
        <Button data-vh="btn-ghost" variant="ghost">Ghost</Button>
      </Row>
      <Row id="button-destructive" label="Button / destructive">
        <Button data-vh="btn-destructive" variant="destructive">Destructive</Button>
      </Row>
      <Row id="button-disabled" label="Button / disabled">
        <Button data-vh="btn-disabled" disabled>Disabled</Button>
      </Row>

      <Row id="input" label="Input">
        <Input data-vh="input" placeholder="Type here" className="w-64" />
      </Row>
      <Row id="input-disabled" label="Input / disabled">
        <Input data-vh="input-disabled" placeholder="Disabled" disabled className="w-64" />
      </Row>

      <Row id="textarea" label="Textarea">
        <Textarea data-vh="textarea" placeholder="Notes" className="w-64" />
      </Row>

      <Row id="select" label="Select">
        <Select>
          <SelectTrigger data-vh="select" className="w-64">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </Row>

      <Row id="checkbox" label="Checkbox">
        <Checkbox data-vh="checkbox" />
        <Checkbox data-vh="checkbox-checked" defaultChecked />
        <Checkbox data-vh="checkbox-disabled" disabled />
      </Row>

      <Row id="radio" label="Radio">
        <RadioGroup defaultValue="b" className="flex gap-3">
          <RadioGroupItem data-vh="radio-a" value="a" />
          <RadioGroupItem data-vh="radio-b" value="b" />
          <RadioGroupItem data-vh="radio-disabled" value="c" disabled />
        </RadioGroup>
      </Row>

      <Row id="switch" label="Switch">
        <Switch data-vh="switch-off" />
        <Switch data-vh="switch-on" defaultChecked />
        <Switch data-vh="switch-disabled" disabled />
      </Row>

      <Row id="slider" label="Slider">
        <Slider data-vh="slider" defaultValue={[40]} max={100} step={1} className="w-64" />
      </Row>

      <Row id="toggle" label="Toggle">
        <Toggle data-vh="toggle">Toggle</Toggle>
        <Toggle data-vh="toggle-on" defaultPressed>On</Toggle>
      </Row>

      <Row id="tabs" label="Tabs">
        <Tabs defaultValue="one" className="w-64">
          <TabsList>
            <TabsTrigger data-vh="tab-one" value="one">One</TabsTrigger>
            <TabsTrigger data-vh="tab-two" value="two">Two</TabsTrigger>
          </TabsList>
        </Tabs>
      </Row>
    </div>
  );
}