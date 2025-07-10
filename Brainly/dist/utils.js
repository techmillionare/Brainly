"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
const random = (len) => {
    let options = "qwreweormbclxcfimbsdofdg0395492302@411!#";
    let size = options.length;
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += (options[Math.floor(Math.random() * size)]);
    }
    return ans;
};
exports.random = random;
