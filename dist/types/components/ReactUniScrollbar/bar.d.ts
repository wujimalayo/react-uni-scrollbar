import React from "react";
import "./styles.scss";
interface BarProps {
    type: "vertical" | "horizontal";
    ratio: number;
    length: number;
    translateValue: number;
    hidden: boolean;
    sizeInfo: any;
    onScroll: (v: number, scroll: "scrollTop" | "scrollLeft") => void;
}
/**
 * @type 'vertical'纵向 |'horizontal' 横向
 * @ratio 滑块长度占比
 *  */
declare const Bar: ({ type, ratio, translateValue, hidden, length, sizeInfo, onScroll, }: BarProps) => React.JSX.Element;
export default Bar;
