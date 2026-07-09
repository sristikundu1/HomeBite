import AnimatedCursor from 'react-animated-cursor';

function CustomCursor() {
  return (
    <AnimatedCursor
      innerSize={10}
      outerSize={40}
      outerAlpha={0.2}
      innerScale={0.8}
      outerScale={2}
      color="249, 115, 22"
      trailingSpeed={10}
      clickables={['a', 'button', 'input', 'select', 'textarea', 'label', '[role="button"]', '.cursor-hover']}
      showSystemCursor={false}
    />
  );
}

export default CustomCursor;
