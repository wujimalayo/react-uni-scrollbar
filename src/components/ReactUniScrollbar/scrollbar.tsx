import React, {
  ReactNode,
  CSSProperties,
  useRef,
  useMemo,
  useState,
  UIEventHandler,
} from "react";
import "./styles.scss";
import useResizeObserver from "./hooks/useResizeObserver";
import Bar from "./bar";

interface props {
  height?: number;
  maxHeight?: number;
  wraperStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  children?: ReactNode;
}

const UniScrollBar = ({
  children,
  height,
  maxHeight,
  wraperStyle,
  contentStyle,
}: props) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { width: wrapperWidth, height: wrapperHeight } =
    useResizeObserver(wrapperRef);
  const { width: contentWidth, height: contentHeight } =
    useResizeObserver(contentRef);

  // 获取scroll长宽参数后统一计算所需信息
  const {
    showVerticalBar,
    showHorizontalBar,
    heightRatio,
    widthRatio,
    thumbHeight,
    thumbWidth,
  } = useMemo(() => {
    const showVerticalBar = contentHeight > wrapperHeight;
    const showHorizontalBar = contentWidth > wrapperWidth;
    const heightRatio = wrapperHeight / contentHeight;
    const widthRatio = wrapperWidth / contentWidth;
    const thumbHeight = wrapperHeight * heightRatio;
    const thumbWidth = wrapperWidth * widthRatio;
    return {
      showVerticalBar,
      showHorizontalBar,
      heightRatio,
      widthRatio,
      thumbHeight,
      thumbWidth,
    };
  }, [wrapperWidth, wrapperHeight, contentWidth, contentHeight]);

  const [hiddenBar, setHiddenBar] = useState(true);
  const [translateY, setTranslateY] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const setScroll = (value: number, scroll: "scrollTop" | "scrollLeft") => {
    const wrapElement = wrapperRef.current as HTMLElement;
    wrapElement[scroll] = value;
  };

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const Yalue = heightRatio * e.currentTarget.scrollTop;
    const maxY = (wrapperHeight - 4) * (1 - heightRatio);
    const Xalue = widthRatio * e.currentTarget.scrollLeft;
    const maxX = (wrapperWidth - 4) * (1 - widthRatio);
    setTranslateY(Yalue > maxY ? maxY : Yalue);
    setTranslateX(Xalue > maxX ? maxX : Xalue);
  };

  return (
    <div
      className={"uni-scrollbar"}
      onPointerEnter={() => setHiddenBar(false)}
      onPointerLeave={() => setHiddenBar(true)}
    >
      <div
        ref={wrapperRef}
        className={"uni-scrollbar-wrapper"}
        style={{
          ...wraperStyle,
          height,
          maxHeight,
        }}
        onScroll={handleScroll}
      >
        <div
          ref={contentRef}
          className={"uni-scrollbar-content"}
          style={{
            ...contentStyle,
          }}
        >
          {children}
        </div>
      </div>
      {showVerticalBar && (
        <Bar
          type="vertical"
          hidden={hiddenBar}
          ratio={heightRatio}
          length={thumbHeight}
          translateValue={translateY}
          sizeInfo={{
            wrapperWidth,
            wrapperHeight,
            contentWidth,
            contentHeight,
          }}
          onScroll={setScroll}
        />
      )}
      {showHorizontalBar && (
        <Bar
          type="horizontal"
          hidden={hiddenBar}
          ratio={widthRatio}
          length={thumbWidth}
          translateValue={translateX}
          sizeInfo={{
            wrapperWidth,
            wrapperHeight,
            contentWidth,
            contentHeight,
          }}
          onScroll={setScroll}
        />
      )}
    </div>
  );
};

export default UniScrollBar;
