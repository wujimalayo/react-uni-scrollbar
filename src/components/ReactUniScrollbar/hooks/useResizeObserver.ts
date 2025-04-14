import { useState, useEffect, RefObject } from "react";

const useResizeObserver = (elementRef:RefObject<HTMLElement | null>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // 确保 ref 当前指向一个 DOM 元素
    if (!elementRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    // 开始观察 ref 当前指向的元素
    observer.observe(elementRef.current);

    // 清理函数，在组件卸载时断开观察
    return () => {
      observer.disconnect();
    };
  }, []); // 空依赖数组表示只在组件挂载和卸载时执行

  return dimensions;
};

export default useResizeObserver