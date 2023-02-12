import { Injector, components, webpack, common, ModuleExports } from "replugged";
const { MenuItem, MenuGroup } = components.ContextMenu;
const { React } = common

import type { User } from "discord-types/general";
import type { } from "discord-types/stores";

import { prompToUpload } from "./utils";


export function insertMenuItem(menuItems: typeof MenuGroup, e: {guildId: number, user: User & {guildAvatars: Record<number, string>}}) {
  const {guildId, user} = e
  let {avatar} = user
  const {guildAvatars, id} = user

  if (guildAvatars) {
    avatar = guildAvatars[guildId]
  }

  const PetpetItem = (<MenuGroup>
    <MenuItem
      id="petpet"
      label="Generate Petpet"
      action={() => makePetpet(id, avatar)}
    />
  </MenuGroup>)

  menuItems.props.children.splice(-1, 0, PetpetItem)

  return menuItems
}


export async function makePetpet(id: string, avatarHash: string) {
  const url = `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.png`

  //disabled while debugging
  const avatar = await loadImage(url)
  const res = await petpet(avatar, {})
  const file = new File([res], "petpet.gif", {type: "image/gif"})

  //enabled while debugging
  // const response = await fetch(url)
  // const blob = await response.blob()
  // const file = new File([blob], "test.png", {type: "image/png"})

  // frames = await loadFrames()
  // console.log(frames)


  prompToUpload(file)
}



// petpet magic

import { GifEncoder } from "../gifencoder";


let frames: Array<any> = []
const defaults = {
  resolution: 256,
  delay: 30
};

// Based on https://github.com/aDu/pet-pet-gif, licensed under ISC
export async function petpet(avatar, options) {
  if (frames.length === 0) {
    frames = await loadFrames();
  }

  const FRAMES = frames.length;

  options = { ...defaults, ...options };
  const encoder = new GifEncoder(options.resolution, options.resolution);

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(options.delay);
  encoder.setTransparent(0);

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = options.resolution;
  const ctx = canvas.getContext("2d", {"alpha": true, "willReadFrequently": true})!;

  for (let i = 0; i < FRAMES; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const j = i < FRAMES / 2 ? i : FRAMES - i;

      const width = 0.8 + j * 0.02;
      const height = 0.8 - j * 0.05;
      const offsetX = (1 - width) * 0.5 + 0.1;
      const offsetY = 1 - height - 0.08;

      ctx.drawImage(avatar, options.resolution * offsetX, options.resolution * offsetY, options.resolution * width, options.resolution * height);
      ctx.drawImage(frames[i], 0, 0, options.resolution, options.resolution);

      encoder.addFrame(ctx);
  }

  encoder.finish();
  return encoder.out.getData();
}

async function loadFrames(): Promise<Array<any>> {
  return await Promise.all(
    Array(10)
    .fill(null)
    .map((_, i) => {
      const url = `https://raw.githubusercontent.com/aDu/pet-pet-gif/main/img/pet${i}.gif`
      return loadImage(url)
    })
  )
}

function loadImage(src): Promise<HTMLImageElement> {
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

// export async function start(): Promise<void> {
//   /*
//   {// const typingMod = await webpack.waitForModule<{
//   //   startTyping: (channelId: string) => void;
//   // }>(webpack.filters.byProps("startTyping"));
//   // const getChannelMod = await webpack.waitForModule<{
//   //   getChannel: (id: string) => {
//   //     name: string;
//   //   };
//   // }>(webpack.filters.byProps("getChannel"));

//   // if (typingMod && getChannelMod) {
//   //   inject.instead(typingMod, "startTyping", ([channel]) => {
//   //     const channelObj = getChannelMod.getChannel(channel);
//   //     console.log(`Typing prevented! Channel: #${channelObj?.name ?? "unknown"} (${channel}).`);
//   //   });
//   // }
//   console.log(components)
//   console.log(components.ContextMenu)
//   console.log(replugged)

//   console.log('b')
//   await webpack.waitForReady
//   await webpack.waitForStart
//   const menuMod = await webpack.waitForModule(webpack.filters.bySource("♫ ⊂(｡◕‿‿◕｡⊂) ♪"));
//   console.log(menuMod)
//   console.log('c')
//   // webpack.common

//   inject.after(replugged.common.contextMenu, "open", (args, res, self) => {
//     console.log(args)
//     console.log(res)
//     console.log(self)
//   })





//   // console.log(replugged.common.contextMenu.open())

  





  
//   // const mod = await webpack.waitForModule(webpack.filters.bySource('type:"CONTEXT_MENU_OPEN"'));

//   // console.log(mod)
//   // // console.log(webpack.getFunctionKeyBySource("stopPropagation", mod))  // <- that is a function that gets called, but not the one we want to override  // or not?
//   // const old_mod = inject.after(mod, "jW", async (args, res, self) => {
//   // // const old_mod = inject.after(mod, webpack.getFunctionKeyBySource("stopPropagation", mod), (args, res, self) => {
//   //   console.log(args)
//   //   console.log(res)
//   //   console.log(self)
//   //   console.log((new Error()).stack) 
//   //   console.log((await args[1](args[0]))(args[0]))
//   // })
//   // console.log(mod.jW)

//   // // inject.after(webpack.getByProps("onContextMenu"), webpack.getFunctionKeyBySource("onContextMenu"), (...all) => {
//   // //   console.log(all)
//   // // })

     
  
//   // inject.after(webpack.getByProps("handleContextMenu"), "handleContextMenu", (...all) => {
//   //   console.log(all)
//   // })

//   webpack.getByProps("getContextMenu")

//   const a = webpack.getByProps("getContextMenu")
//   const b = webpack.getByProps("register")

//   // replugged.components.ContextMenu.ContextMenu() // needs navId

//   // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
//   function wtf(func: () => void) {
//     console.log("wtf")
//     console.log(func)
//     console.log(func()) // this gets the user or channel that the thing selected
//     webpack.common.ReactDOM.findDOMNode(this).parentNode


//   }


//   inject.after(webpack.getByProps("getContextMenu"), "getContextMenu", (args, res, self) => {
//     console.log(args)
//     console.log(res)
//     console.log(self)
//     try {
//       // components.ContextMenu.ContextMenu(res?.target)
//       console.log(res?.renderLazy)
//       res?.renderLazy().then((func) => {
//         console.log("wtf")
//         console.log(func)
//         const ret = func() // this gets the user or channel that the thing selected
//         console.log(ret)
//         // console.log(common.ReactDOM.findDOMNode(ret).parentNode)
//       })

//       console.log(res?.render)
//     } catch (e) {
//       console.error(e)
//     }
//   })}
//   */


// }




export function stop(): void {
  // inject.uninjectAll();
  // wtf goes here?
}
