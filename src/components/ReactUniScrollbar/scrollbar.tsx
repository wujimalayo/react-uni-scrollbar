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
  children?: ReactNode;
  height?: number;
  maxHeight?: number;
  style?: CSSProperties;
  wraperStyle?: CSSProperties;
  wraperClass?: string;
  contentStyle?: CSSProperties;
  contentClass?: string;
  alwaysShow?: boolean;
  hiddenDelay?: number;
  trackProps?: {
    width?: CSSProperties["width"] & string;
    borderRadius?: CSSProperties["borderRadius"] & string;
    backgroundColor?: CSSProperties["backgroundColor"];
    hoverBackgroundColor?: CSSProperties["backgroundColor"];
  };
  thumbProps?: {
    width?: CSSProperties["width"] & string;
    backgroundColor?: CSSProperties["backgroundColor"];
    hoverBackgroundColor?: CSSProperties["backgroundColor"];
  };
}

/**
 * @param height 滚动容器高度
 * @param maxHeight 滚动容器最大高度
 * @param style 最外层容器样式
 * @param wraperStyle 滚动容器的自定义样式
 * @param wraperClass 滚动容器的自定义类名
 * @param contentStyle 内容视图自定义样式
 * @param contentClass 内容视图自定义类名
 * @param alwaysShow 滚动条总是显示 默认 false
 * @param hiddenDelay 滚动条延迟隐藏时间(ms) 默认 1000
 * @param trackProps.width 滚动条轨道宽度，建议大于滚动条滑块宽度
 * @param trackProps.backgroundColor 滚动条轨道背景色
 * @param trackProps.borderRadius 滚动条轨道圆角，滚动条滑块圆角同步此属性
 * @param trackProps.hoverBackgroundColor 滚动条轨道悬停背景色
 * @param thumbProps.width 滚动条滑块宽度，建议小于滚动条轨道宽度
 * @param thumbProps.backgroundColor 滚动条滑块背景色
 * @param thumbProps.hoverBackgroundColor 滚动条滑块悬停背景色
 *  */

const UniScrollBar = ({
  children,
  height,
  maxHeight,
  style,
  wraperStyle,
  wraperClass,
  contentStyle,
  contentClass,
  alwaysShow = false,
  hiddenDelay = 1000,
  trackProps = {
    width: "6px",
    borderRadius: "4px",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    hoverBackgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  thumbProps = {
    width: "6px",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    hoverBackgroundColor: "rgba(0, 0, 0, 0.45)",
  },
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

  const [hiddenBar, setHiddenBar] = useState(!alwaysShow);
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

    handleShowBar();
  };

  let showBarTimer = useRef(null);
  const handleShowBar = () => {
    if (alwaysShow) return;
    clearTimeout(showBarTimer.current);
    setHiddenBar(false);
    // 重置延迟隐藏计时器
    showBarTimer.current = setTimeout(() => {
      setHiddenBar(true);
    }, hiddenDelay);
    return;
  };

  return (
    <div
      style={
        {
          ...style,
          "--uniscrollbar-track-width": trackProps.width || "6px",
          "--uniscrollbar-track-border-radius":
            trackProps.borderRadius || "4px",
          "--uniscrollbar-track-background-color":
            trackProps.backgroundColor || "rgba(0, 0, 0, 0.1)",
          "--uniscrollbar-track-hover-background-color":
            trackProps.hoverBackgroundColor || "rgba(0, 0, 0, 0.15)",

          "--uniscrollbar-thumb-width": thumbProps.width || "6px",
          "--uniscrollbar-thumb-background-color":
            thumbProps.backgroundColor || "rgba(0, 0, 0, 0.25)",
          "--uniscrollbar-thumb-hover-background-color":
            thumbProps.hoverBackgroundColor || "rgba(0, 0, 0, 0.45)",
        } as CSSProperties
      }
      className={"uni-scrollbar"}
      onPointerMove={() => handleShowBar()}
    >
      <div
        ref={wrapperRef}
        className={["uni-scrollbar-wrapper", wraperClass]
          .filter(Boolean)
          .join(" ")}
        style={{
          ...wraperStyle,
          height,
          maxHeight,
        }}
        onScroll={handleScroll}
      >
        <div
          ref={contentRef}
          className={["uni-scrollbar-content", contentClass]
            .filter(Boolean)
            .join(" ")}
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
