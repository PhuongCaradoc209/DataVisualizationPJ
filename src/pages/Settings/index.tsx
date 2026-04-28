import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Workspace configuration for future integrations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Basic preferences (placeholder)</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:max-w-xl">
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-slate-700">Display name</span>
              <Input placeholder="Jane Doe" autoComplete="name" />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-medium text-slate-700">Email</span>
              <Input
                type="email"
                placeholder="jane@company.com"
                autoComplete="email"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-medium text-slate-700">Default region</span>
              <Input placeholder="Global" />
            </label>

            <div className="flex justify-end">
              <Button variant="primary">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
