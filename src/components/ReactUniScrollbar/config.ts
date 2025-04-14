export const BAR_MAP: {
  [key: string]: {
    scroll: "scrollTop" | "scrollLeft";
    size: "height" | "width";
    type: "vertical" | "horizontal";
    axis: "Y" | "X";
    client: "clientY" | "clientX";
    direction: "top" | "left";
    wrapperLength: string;
    contentLength: string;
    movement: "movementY" | "movementX";
  };
} = {
  vertical: {
    scroll: "scrollTop",
    size: "height",
    type: "vertical",
    axis: "Y",
    client: "clientY",
    direction: "top",
    wrapperLength: "wrapperHeight",
    contentLength: "contentHeight",
    movement: "movementY",
  },
  horizontal: {
    scroll: "scrollLeft",
    size: "width",
    type: "horizontal",
    axis: "X",
    client: "clientX",
    direction: "left",
    wrapperLength: "wrapperWidth",
    contentLength: "contentWidth",
    movement: "movementX",
  },
};
