/* powercord-petpet, a Powercord Plugin to create petting gifs
 * Copyright 2022 Catalyst4
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { Plugin } = require("powercord/entities");
const { channels, getModule, React } = require("powercord/webpack");
const readFile = require("util").promisify(require("fs").readFile);
const { getAllModules } = require("powercord/webpack");
const { join } = require("path");
const { inject, uninject } = require('powercord/injector');
const { findInReactTree, getOwnerInstance } = require('powercord/util');

const GifEncoder = require("./gifencoder");

const defaults = {
    resolution: 256,
    delay: 30
};

module.exports = class PetPet extends Plugin {
    async startPlugin() {
        // console.log("petpet loaded? hopefully?")

        const { MenuGroup, MenuItem } = await getModule(["MenuGroup", "MenuItem"]);
        const Menu = await getModule([ 'MenuItem' ]);

        // let menues = getAllModules(
        //     (m) => (m.__powercordOriginal_default || m.default)?.displayName?.toLowerCase()?.match("menu")
        // )

        // console.log(menues)
        // console.log(menues[4])
        // console.log(menues[11])
        // console.log(menues[26])

        // let contexts = getAllModules(
        //     (m) => (m.__powercordOriginal_default || m.default)?.displayName?.toLowerCase()?.match("context")
        // )
        // console.log(contexts)


        inject('cata-petpet-avatar', Menu, 'default', (args) => {

            const [ { navId, children } ] = args;
            if (navId !== 'user-context') {
              return args;
            }


            const hasPetPetItem = findInReactTree(children, child => child.props && child.props.id === 'petpet');
            if (hasPetPetItem) {
                return args;
            }
            console.log("not in tree")

            let user;

            if (document.querySelector('#user-context')) {
              const instance = getOwnerInstance(document.querySelector('#user-context'));
              user = (instance?._reactInternals || instance?._reactInternalFiber)?.return?.memoizedProps?.user;
            }
    
            if (!user) {
              return args;
            }
            console.log("user menu")

            const petpetItem = React.createElement(Menu.MenuItem, {
                id: 'petpet',
                label: 'Generate PetPet',
                action: () => {this.createImageAndSend(args, user)}
            });

            const devmodeItem = findInReactTree(children, child => child.props && child.props.id === 'devmode-copy-id');
            const developerGroup = children.find(child => child.props && child.props.children === devmodeItem);
            console.log("entering branches")
            if (developerGroup) {
                if (!Array.isArray(developerGroup.props.children)) {
                    developerGroup.props.children = [ developerGroup.props.children ];
                }
    
                developerGroup.props.children.push(petpetItem);
            } else {
                children.push([ React.createElement(Menu.MenuSeparator), React.createElement(Menu.MenuGroup, {}, petpetItem) ]);
            }

            console.log(React)
            console.log("OH SHI-")


            return args
        }, true);
        console.log("post inject")
    }

    pluginWillUnload() {
        console.log("petpet unloaded")
        uninject('cata-petpet-avatar');
        // powercord.api.commands.unregisterCommand("petpet");
        //should probably uninject something?
    }


    async createImageAndSend(args, user) {
        const { promptToUpload } = await getModule(["promptToUpload"]);
        const { getChannel } = await getModule(["getChannel", "hasChannel"])

        console.log(args)
        console.log(user)
        // url = user.getAvatarUrl()
        const url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`

        const av = await this.loadImage(url, false).catch(() => void 0);
        if (!av) return;

        console.log("preparing to build buffer")
        let buf;
        try {
            buf = await this.petpet(av, {});  // no options
        } catch (error) {
            this.error(error);
            return
        }
        console.log("built buffer")

        let name = "petpet.gif";

        const file = new File([buf], name, { type: "image/gif" });
        console.log("about to prompt")
        promptToUpload([file], getChannel(channels.getChannelId()), 0);
    }


    /* Things that do image magic */

    parseInt(str, type) {
        const n = parseInt(str);
        if (isNaN(n)) return `${type} must be a number, received \`${str}\``;
        if (n <= 0) return `${type} must be bigger than 0, received \`${str}\``;
        return n;
    }

    loadImage(src, local) {
        return new Promise(async (resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                if (local) URL.revokeObjectURL(src);
                resolve(img);
            };
            img.onerror = reject;
            if (local) {
                try {
                    const buf = await readFile(src);
                    const blob = new Blob([buf], { type: "image/gif" });
                    src = URL.createObjectURL(blob);
                } catch (err) {
                    reject(err);
                }
            } else img.crossOrigin = "Anonymous";
            img.src = src;
        });
    }

    
    // Based on https://github.com/aDu/pet-pet-gif, licensed under ISC
    async petpet(avatar, options) {
        if (!this.frames)
            this.frames = await Promise.all(
                Array(10)
                    .fill(null)
                    .map((_, i) => {
                        const filename = join(__dirname, "frames", `pet${i}.gif`);
                        return this.loadImage(filename, true);
                    })
            );

        const FRAMES = this.frames.length;

        options = { ...defaults, ...options };
        const encoder = new GifEncoder(options.resolution, options.resolution);

        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(options.delay);
        encoder.setTransparent();

        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = options.resolution;
        const ctx = canvas.getContext("2d");

        for (let i = 0; i < FRAMES; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const j = i < FRAMES / 2 ? i : FRAMES - i;

            const width = 0.8 + j * 0.02;
            const height = 0.8 - j * 0.05;
            const offsetX = (1 - width) * 0.5 + 0.1;
            const offsetY = 1 - height - 0.08;

            ctx.drawImage(avatar, options.resolution * offsetX, options.resolution * offsetY, options.resolution * width, options.resolution * height);
            ctx.drawImage(this.frames[i], 0, 0, options.resolution, options.resolution);

            encoder.addFrame(ctx);
        }

        encoder.finish();
        return encoder.out.getData();
    }
}