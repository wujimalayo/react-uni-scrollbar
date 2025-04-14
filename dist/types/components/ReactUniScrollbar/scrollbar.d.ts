import React, { ReactNode, CSSProperties } from "react";
import "./styles.scss";
interface props {
    height?: number;
    maxHeight?: number;
    wraperStyle?: CSSProperties;
    contentStyle?: CSSProperties;
    children?: ReactNode;
}
declare const UniScrollBar: ({ children, height, maxHeight, wraperStyle, contentStyle, }: props) => React.JSX.Element;
export default UniScrollBar;
