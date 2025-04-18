import React, { useMemo, useRef, useEffect, MouseEvent } from "react";
import "./styles.scss";
import { BAR_MAP } from "./config";

interface BarProps {
  type: "vertical" | "horizontal";
  ratio: number;
  length: number;
  translateValue: number;
  hidden: boolean;
  sizeInfo: any;
  onScroll: (v: number, scroll: "scrollTop" | "scrollLeft") => void;
}

// 保存浏览器选择事件的原始状态
let originalOnSelectStart:
  | ((this: GlobalEventHandlers, ev: Event) => any)
  | null = document.onselectstart;
  
const Bar = ({
  type,
  ratio,
  translateValue,
  hidden,
  length,
  sizeInfo,
  onScroll,
}: BarProps) => {
  const bar = useMemo(() => BAR_MAP[type], []);
  const isMouseDown = useRef(false);
  // 当前滚动的距离
  const scrollDistance = useRef(translateValue / ratio);

  const handleClickTrack = (e: MouseEvent) => {
    document.onselectstart = () => false;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offset = Math.abs(e[bar.client] - rect[bar.direction]);
    const halfThumb = length / 2;
    let scroll = 0;
    if (offset > halfThumb) {
      const scrollRatio = (offset - halfThumb) / sizeInfo[bar.wrapperLength];
      scroll = scrollRatio * sizeInfo[bar.contentLength];
    }
    scrollDistance.current = scroll;
    onScroll(scroll, bar.scroll);
  };

  const handleClickThumb = (e: MouseEvent) => {
    e.stopPropagation();
    // 拦截ctrl建和鼠标滚轮、右键的事件响应
    if (e.ctrlKey || [1, 2].includes(e.button)) return;
    // 清除当前选中内容
    window.getSelection()?.removeAllRanges();
    startDrag(e);
  };

  const startDrag = (e: MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation();
    isMouseDown.current = true;
    // 更新当前滚动距离
    scrollDistance.current = translateValue / ratio;
    document.addEventListener("mousemove", mouseMoveDocumentHandler);
    document.addEventListener("mouseup", mouseUpDocumentHandler);
    // 绑定当前上下文
    originalOnSelectStart = document.onselectstart;
    document.onselectstart = () => false;
  };

  const mouseMoveDocumentHandler = (e: any) => {
    if (isMouseDown.current === false) return;
    const event = e as MouseEvent;
    const distance = scrollDistance.current + event[bar.movement] / ratio;
    // 计算后的滚动距离小于0则不需要触发更新
    if (distance <= 0) return;
    // 计算后的滚动距离大于可滚动的最大值也不需要触发更新
    if (distance >= (sizeInfo[bar.contentLength] - 4) * (1 - ratio)) return;
    scrollDistance.current =
      scrollDistance.current + event[bar.movement] / ratio;
    onScroll(scrollDistance.current, bar.scroll);
  };

  const mouseUpDocumentHandler = () => {
    isMouseDown.current = false;
    document.removeEventListener("mousemove", mouseMoveDocumentHandler);
    document.removeEventListener("mouseup", mouseUpDocumentHandler);
    restoreOnselectstart();
  };

  // 恢复浏览器选择事件的原始状态
  const restoreOnselectstart = () => {
    if (document.onselectstart !== originalOnSelectStart)
      document.onselectstart = originalOnSelectStart;
  };

  useEffect(() => {
    return () => {
      restoreOnselectstart();
      document.removeEventListener("mouseup", mouseUpDocumentHandler);
    };
  }, []);

  return (
    <div
      onMouseDown={handleClickTrack}
      className={[
        hidden && !isMouseDown.current && "uni-scrollbar-bar__hidden",
        "uni-scrollbar-bar",
        `uni-scrollbar-${type}`,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        onMouseDown={handleClickThumb}
        style={{
          [bar.size]: length,
          transform: `translate${bar.axis}(${translateValue}px)`,
        }}
        className={"uni-scrollbar-bar-thumb"}
      ></div>
    </div>
  );
};

export default Bar;
