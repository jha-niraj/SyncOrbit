# ProjectCentral - Performance Optimizations

## BeamsBackground Optimizations Applied:
1. **Frame Rate Limiting**: Capped at 30 FPS instead of unlimited
2. **Visibility-based Rendering**: Pauses animation when not visible
3. **Reduced Beam Count**: From 30 to ~18 beams for better performance
4. **Optimized Canvas**: Limited device pixel ratio to max 2x
5. **Hardware Acceleration**: Added willChange and transform3d
6. **Reduced Blur**: Less intensive blur effects
7. **Smaller Beam Sizes**: Reduced beam dimensions for faster rendering
8. **Slower Animation Speed**: Smoother, less jarring movements

## SmoothScroll Optimizations:
1. **Adjusted Multipliers**: Reduced wheel/touch sensitivity
2. **Longer Duration**: Smoother transition timing
3. **Better Lerp**: Improved touch responsiveness

## Performance Features:
- Intersection Observer for visibility detection
- Frame rate throttling
- Memory-efficient beam recycling
- Hardware-accelerated rendering
- Optimized mutation observers

These changes should resolve the scroll freezing issue on the "Powering" section.
