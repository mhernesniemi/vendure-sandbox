import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { AdminUiExtension } from "@vendure/ui-devkit/compiler";
import path from "path";

@VendurePlugin({
  imports: [PluginCommonModule],
  compatibility: "^3.0.0",
})
export class CustomerGroupSelectorPlugin {
  static ui: AdminUiExtension = {
    id: "customer-group-selector",
    extensionPath: path.join(__dirname, "ui"),
    providers: ["providers.ts"],
  };
}
