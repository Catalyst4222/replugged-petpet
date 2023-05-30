import { Injector, common, components, settings, types, util } from "replugged";
const { SwitchItem } = components;
const { MenuItem } = components.ContextMenu;
const { React } = common;
const { ContextMenuTypes } = types;

import { User } from "discord-types/general";
import { GifEncoder } from "../gifencoder";
import { prompToUpload } from "./utils";

/* Set up context menus */

const injector = new Injector();

export function start() {
  injector.utils.addMenuItem(ContextMenuTypes.UserContext, insertUser);
  injector.utils.addMenuItem(ContextMenuTypes.Message, insertMessage);
}

export function stop() {
  injector.uninjectAll();
}

export function insertUser(e: { guildId: string; user: User }) {
  return (
    <MenuItem
      id="petpet"
      label="Generate Petpet"
      action={() => makePetpet(e.user.getAvatarURL(e.guildId))}
    />
  );
}

export function insertMessage(data: {
  itemHref?: string;
  itemSrc?: string;
  // eslint-disable-next-line no-undef
}): JSX.Element | undefined {
  // eslint-disable-next-line no-undefined
  if (!data.itemHref && !data.itemSrc) return undefined;

  return (
    <MenuItem
      id="petpet"
      label="Generate Petpet"
      action={() => makePetpet(data.itemHref || (data.itemSrc as string))}
    />
  );
}

export async function makePetpet(url: string) {
  const img = await loadImage(url);
  const res = await petpet(img, {});
  const file = new File([res], "petpet.gif", { type: "image/gif" });
  prompToUpload(file);
}

/* Manage settings */

const defaultSettings = {
  square: false,
  shrink: false,
};

// @ts-expect-error
const cfg = await settings.init<{ square: boolean; shrink: boolean }, keyof typeof defaultSettings>(
  "dev.catalyst.Petpet",
  defaultSettings,
);

export function Settings(): unknown {
  return (
    <div>
      <SwitchItem {...util.useSetting(cfg, "square")}>Force the image into a square</SwitchItem>
      <SwitchItem
        note="Only applies if the image isn't squared"
        {...util.useSetting(cfg, "shrink")}>
        Shrink the entire image into the gif
      </SwitchItem>
    </div>
  );
}

/* Petpet magic */

let frames: Array<HTMLImageElement> = [];
const defaults = {
  resolution: 256,
  delay: 30,
};

// Based on https://github.com/aDu/pet-pet-gif, licensed under ISC
export async function petpet(image: HTMLImageElement, options: Record<string, number & unknown>) {
  if (frames.length === 0) {
    frames = await loadFrames();
  }

  let widthScale = 1;
  let heightScale = 1;

  if (!cfg.get("square", false)) {
    // // Don't you love scaling?

    let scale = image.width / image.height;

    if (cfg.get("shrink")) {
      widthScale *= scale < 1 ? scale : 1 / scale;
      heightScale *= scale < 1 ? scale : 1 / scale;
    }

    if (image.width > image.height) {
      widthScale *= scale;
    } else {
      heightScale *= 1 / scale;
    }
  }

  const FRAMES = frames.length;

  options = { ...defaults, ...options };
  const encoder = new GifEncoder(options.resolution, options.resolution);

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(options.delay);
  encoder.setTransparent(0);

  const canvas = document.createElement("canvas");
  canvas.width = options.resolution;
  canvas.height = options.resolution;
  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true })!;

  for (let i = 0; i < FRAMES; i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const j = i < FRAMES / 2 ? i : FRAMES - i;

    const width = 0.8 + j * 0.02;
    const height = 0.8 - j * 0.05;
    const offsetX = (1 - width) * 0.5 + 0.1;
    const offsetY = 1 - height - 0.08;

    ctx.drawImage(
      image,
      options.resolution * offsetX,
      options.resolution * offsetY,
      options.resolution * width * widthScale,
      options.resolution * height * heightScale,
    );
    ctx.drawImage(frames[i], 0, 0, options.resolution, options.resolution);

    encoder.addFrame(ctx);
  }

  encoder.finish();
  return encoder.out.getData();
}

async function loadFrames(): Promise<Array<HTMLImageElement>> {
  return await Promise.all(
    Array(10)
      .fill(null)
      .map((_, i) => {
        const url = `https://raw.githubusercontent.com/aDu/pet-pet-gif/main/img/pet${i}.gif`;
        return loadImage(url);
      }),
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
    img.crossOrigin = "Anonymous";
    img.src = src;
  });
}
