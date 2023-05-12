// import { PlaintextPatch } from "replugged/dist/types";

// export default [
//   {
//     find: 'navId:"user-context"',
//     replacements: [
//       {
//         match:
//           /(function\((.)\){\nvar.+channel[\s\S]+)return([\s\S]+onSelect:.,children:\[.+)}/gsm,
//         replace:
//           "$1return(()=>{var res = ($3); console.log('hi');window.replugged.plugins.getExports('dev.catalyst.Petpet')?.insertMenuItem?.(res, e); return (res)})()}",
//       },
//     ],
//     check: (source) => {
//       console.log(source);
//       console.log(/(function\((.)\){\nvar.+channel[\s\S]+)return([\s\S]+onSelect:.,children:\[.+)}/gsm.exec(source))
//       return true;
//     },
//   },
// ] as PlaintextPatch[];
