"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsTabs() {
  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <div className="font-medium">Show taxes</div>
                  <p className="text-sm text-muted-foreground">Enable local VAT/GST for supported regions.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <div className="font-medium">Prorate upgrades</div>
                  <p className="text-sm text-muted-foreground">Charge the difference when upgrading mid-cycle.</p>
                </div>
                <Switch />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="pt-4">
            <div className="text-sm text-muted-foreground">Billing settings and gateways would appear here.</div>
          </TabsContent>

          <TabsContent value="usage" className="pt-4">
            <div className="text-sm text-muted-foreground">Usage & limits configuration would appear here.</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
