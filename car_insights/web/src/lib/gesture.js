// Where a flick of `velocity` px/s ends up, with UIScrollView-style deceleration.
export const project = (velocity, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate);

// A swipe-back closes when its projected end passes half the width.
export const shouldClose = (offset, velocity, width) => offset + project(velocity) > width / 2;
