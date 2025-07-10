export const random = (len: number) => {
    let options = "qwreweormbclxcfimbsdofdg0395492302@411!#";
    let size = options.length;
    let ans = ""
    for(let i = 0;i < len;i++){
        ans += (options[Math.floor(Math.random() * size)]);
    }
    return ans;
}