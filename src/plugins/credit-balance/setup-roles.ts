import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  RoleService,
  ChannelService,
  Permission,
  RequestContext,
} from "@vendure/core";
import { addCreditPermission } from "./constants";

@Injectable()
export class SetupRolesService implements OnModuleInit {
  constructor(
    private roleService: RoleService,
    private channelService: ChannelService
  ) {}

  async onModuleInit() {
    let defaultChannel;
    try {
      defaultChannel = await this.channelService.getDefaultChannel();
    } catch (error) {
      console.error(
        "The default channel was not found, or the channel search failed:",
        error
      );
      return;
    }

    const ctx = new RequestContext({
      apiType: "admin",
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
      channel: defaultChannel,
      languageCode: defaultChannel.defaultLanguageCode,
    });

    const roles = await this.roleService.findAll(ctx);
    const existingRole = roles.items.find((role) => role.code === "shop-admin");

    if (!existingRole) {
      await this.roleService.create(ctx, {
        code: "shop-admin",
        description:
          "Role for shop administrators with permission to add credits",
        permissions: [Permission.Authenticated, addCreditPermission.Permission],
      });
    }
  }
}
