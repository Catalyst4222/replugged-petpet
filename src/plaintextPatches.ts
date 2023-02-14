import { PlaintextPatch } from "replugged/dist/types";

export default [
  {
    find: 'navId:"user-context"',
    replacements: [
      {
        match:
          /(function\((.)\){var.+channel[\s\S]+)return([\s\S]+onSelect:.,children:\[.+\w+}\)\]}\))}/g,
        replace:
          "$1return(()=>{var res = ($3); window.replugged.plugins.getExports('dev.catalyst.Petpet')?.insertMenuItem?.(res, e); return (res)})()}",
      },
    ],
  },
] as PlaintextPatch[];
