import { Guild, User } from "discord-types/general";
import { common, webpack } from "replugged";
const {
  guilds: { getCurrentGuild },
  users: { getCurrentUser },
  channels: { getChannelId },
} = common;

import type { FileUploadMod, NitroLevel } from "./types";

/* Discord nitro levels */

const nitroLevelMod = webpack.getBySource("screenShareQualityFramerate")!;
export const nitroLevels = Object.values(nitroLevelMod)
  .filter((value) => Object.keys(value as object).length === 4)
  .filter((value) => Object.values(value as object).every((item) => item?.limits))[0] as Record<
  number,
  NitroLevel
>;

const getUserMaxFileSize = webpack.getByProps("getUserMaxFileSize")!.getUserMaxFileSize as (
  user: User,
) => number;

function getGuildMaxFileSize(guild: Guild | undefined = getCurrentGuild()): number {
  return nitroLevels[guild?.premiumTier || 0].limits.fileSize;
}

function getMaxUploadSize(guild: Guild = getCurrentGuild()): number {
  const guildMax = getGuildMaxFileSize(guild);
  const userMax = getUserMaxFileSize(getCurrentUser());

  return Math.max(guildMax, userMax);
}

/* Uploading files */

const { addFile } = webpack.getBySource("UPLOAD_ATTACHMENT_ADD_FILES") as unknown as FileUploadMod;

export function prompToUpload(file: File): void {
  addFile({
    file: { file, platform: 1 },
    channelId: getChannelId(),
    showLargeMessageDialog: file.size > getMaxUploadSize(), // todo check this
    draftType: 0, // todo figure these out, but it seems to consistently be 0
  });
}
