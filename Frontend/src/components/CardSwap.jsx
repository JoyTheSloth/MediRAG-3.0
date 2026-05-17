import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const container = useRef(null);
  const items = useMemo(() => Children.toArray(children), [children]);
  const refs = useRef([]);
  const order = useRef([]);
  const tl = useRef(null);
  const timer = useRef(null);
  const isPaused = useRef(false);

  // Initialize refs and order only once or when item count changes
  if (refs.current.length !== items.length) {
    refs.current = items.map((_, i) => refs.current[i] || React.createRef());
    order.current = Array.from({ length: items.length }, (_, i) => i);
  }

  const config = useMemo(() => (
    easing === 'elastic'
      ? { ease: 'elastic.out(1, 0.75)', duration: 1.4, overlap: 0.85 }
      : { ease: 'power3.inOut', duration: 0.8, overlap: 0.5 }
  ), [easing]);

  const getSlot = (slotIdx, total) => ({
    x: slotIdx * cardDistance,
    y: -slotIdx * verticalDistance,
    z: -slotIdx * 60,
    zIndex: total - slotIdx,
    opacity: 1 - (slotIdx * 0.1),
    scale: 1 - (slotIdx * 0.04)
  });

  const layout = (instantly = false) => {
    const total = items.length;
    order.current.forEach((cardIdx, slotIdx) => {
      const el = refs.current[cardIdx].current;
      if (!el) return;
      const slot = getSlot(slotIdx, total);
      
      if (instantly) {
        gsap.set(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          opacity: slot.opacity,
          scale: slot.scale,
          xPercent: -50,
          yPercent: -50,
          skewY: skewAmount,
          transformOrigin: 'center center',
          force3D: true
        });
      }
    });
  };

  const swap = () => {
    if (isPaused.current || items.length < 2) return;
    if (tl.current && tl.current.isActive()) return;

    const total = items.length;
    const currentOrder = [...order.current];
    const frontIdx = currentOrder.shift();
    currentOrder.push(frontIdx);
    
    const elFront = refs.current[frontIdx].current;
    if (!elFront) return;

    const newTl = gsap.timeline({
      onComplete: () => {
        order.current = currentOrder;
      }
    });
    tl.current = newTl;

    // 1. Drop the front card
    newTl.to(elFront, {
      y: '+=450',
      opacity: 0,
      scale: 0.8,
      rotationX: -15,
      duration: config.duration,
      ease: 'power2.in'
    });

    // 2. Advance the rest
    currentOrder.forEach((cardIdx, slotIdx) => {
      if (slotIdx === total - 1) return; // This is the front card we moved to back
      const el = refs.current[cardIdx].current;
      const slot = getSlot(slotIdx, total);
      newTl.to(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        zIndex: slot.zIndex,
        opacity: slot.opacity,
        scale: slot.scale,
        duration: config.duration,
        ease: config.ease
      }, `-=${config.duration * config.overlap}`);
    });

    // 3. Return front card to the back position
    const backSlot = getSlot(total - 1, total);
    newTl.set(elFront, { zIndex: backSlot.zIndex }, '-=0.2');
    newTl.to(elFront, {
      x: backSlot.x,
      y: backSlot.y,
      z: backSlot.z,
      opacity: backSlot.opacity,
      scale: backSlot.scale,
      rotationX: 0,
      duration: config.duration * 0.8,
      ease: 'power2.out'
    }, '-=0.4');
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      layout(true);
      timer.current = setInterval(swap, delay);
    }, container);

    return () => {
      ctx.revert();
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, cardDistance, verticalDistance, skewAmount, config]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      isPaused.current = true;
      if (tl.current) tl.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      isPaused.current = false;
      if (tl.current) tl.current.play();
    }
  };

  return (
    <div 
      ref={container} 
      className="card-swap-container" 
      style={{ 
        width, 
        height, 
        perspective: '1200px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {items.map((child, i) => (
        isValidElement(child) ? cloneElement(child, {
          key: i,
          ref: refs.current[i],
          style: { 
            width, 
            height, 
            position: 'absolute', 
            top: '50%', 
            left: '50%',
            ...(child.props.style || {}) 
          },
          onClick: (e) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        }) : child
      ))}
    </div>
  );
};

export default CardSwap;
