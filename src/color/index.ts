const RGB_VALUE_MAX = 255;
const BACKGROUND_COLOR = 48;
const FONT_COLOR = 38;
const COLOR_REFLEX = `\u001B[`
const CLEAR_COLOR = `${COLOR_REFLEX}0m`

export const randomColorValue = () => {
    return Math.floor(Math.random() * RGB_VALUE_MAX);
}
// red 247, 78, 30
const valid = (...ins: number[]) => {
    for (let result of ins) {
        if (result > RGB_VALUE_MAX) {
            throw new Error("color value max is " + RGB_VALUE_MAX);
        }
        if (result < 0) {
            throw new Error("color value min is 0 ");
        }
    }
}


export class Index {
    R: number
    G: number
    L: number

    constructor(r: number, g: number, l: number) {
        this.R = r;
        this.G = g;
        this.L = l;
    }
}


/**
 *  @link https://wuxin0011.github.io/java/custom-color-print/#%E6%80%9D%E8%B7%AF%E6%9D%A5%E6%BA%90
 */
export class CustomColor {

    public static fontColor(R: number, G: number, L: number, ...content: any[]) {
        return `${COLOR_REFLEX}${FONT_COLOR};2;${R};${G};${L}m${content}${CLEAR_COLOR}`;
    }

    public static backgroundColor(R: number, G: number, L: number, ...content: any[]) {
        return `${COLOR_REFLEX}${BACKGROUND_COLOR};2;${R};${G};${L}m${content}${CLEAR_COLOR}`;
    }

    public static backgroundAndFontColor(R: number, G: number, L: number, R1: number, G1: number, L1: number, ...content: any[]) {
        valid(R1, G1, L1, R, G, L);
        return `${COLOR_REFLEX}${BACKGROUND_COLOR};2;${R};${G};${L}m${COLOR_REFLEX}${FONT_COLOR};2;${R1};${G1};%${L1}m${content}${CLEAR_COLOR}`;
    }

}

