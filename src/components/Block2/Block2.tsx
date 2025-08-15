// components/Block/Block.tsx
import { useLayoutEffect, useRef, useState } from 'react';
import './Block2.css';
import { Dots } from '../../assets';
import clsx from 'clsx';

interface BlockProps {
  id: string;
  text: string;
  indicator: number;
  indicatorStatus: boolean;
  variant: 'text' | 'imageLeft' | 'imageTop' | 'imageBottom';
  img?: string | undefined;
}
export default function Block2({
  id,
  text,
  indicator,
  indicatorStatus,
  img,
  variant,
}: BlockProps) {

  const blockRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const inlineRef = useRef<HTMLSpanElement>(null);
  const [extraPaddingTop, setExtraPaddingTop] = useState(0);
  const [indicatorJumped, setIndicatorJumped] = useState(false);
  const [linesCount, setLinesCount] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!inlineRef.current || !textRef.current || !blockRef.current) return;
      //const textEl = textRef.current;
      const blockEl = blockRef.current;
      //const style = getComputedStyle(textEl);
      //const lineHeight = parseFloat(style.lineHeight || '0') || textEl.clientHeight;
      const range = document.createRange();
      range.selectNodeContents(inlineRef.current);
      const rects = Array.from(range.getClientRects());
      if (!rects.length) {
        setLinesCount(0);
        setIndicatorJumped(false);
        return;
      }
      const lastRect = rects[rects.length - 1];
      const lines = rects.length;
      setLinesCount(lines);
      const indicatorEl = blockEl.querySelector('.indicator2') as HTMLElement | null;
      if (!indicatorEl || indicator <= 0) {
        setExtraPaddingTop(0);
        setIndicatorJumped(false);
      } else {
        const indicatorRect = indicatorEl.getBoundingClientRect();
        const safeGap = 2;
        const overlaps = lastRect.right > (indicatorRect.left - safeGap);

        let shouldShiftText = false;
        if (variant === 'imageLeft') {
          shouldShiftText = lines >= 3 && overlaps;
        } else {
          shouldShiftText = variant !== 'imageBottom' && overlaps;
        }

        setExtraPaddingTop(shouldShiftText ? 16 : 0);
        setIndicatorJumped(shouldShiftText);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (blockRef.current) ro.observe(blockRef.current);
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => { });
    }
    return () => ro.disconnect();
  }, [text, indicator, variant, id]);
  const effectiveLines = linesCount === 1 && indicatorJumped ? 2 : linesCount;
  let paddingTop = 0;
  let paddingBottom = 0;
  if (variant === 'text') {
    if (effectiveLines <= 1) {
      paddingTop = 24;
      paddingBottom = 24;
    } else {
      paddingTop = 16;
      paddingBottom = 16;
    }
  } else if (variant === 'imageLeft') {
    paddingTop = 16;
    paddingBottom = 16;
  } else {
    paddingTop = variant === 'imageTop' ? 8 : 16;
    paddingBottom = variant === 'imageBottom' ? 8 : 16;
  }
  const finalPaddingTop = paddingTop;
  const contentAlign =
    variant === 'imageLeft' ? (effectiveLines <= 2 ? 'center' : 'flex-start') : undefined;
  const dotsClassName = clsx('dots', variant === 'imageTop' && 'blur');
  const indicatorClassName = 'indicator2'
    .concat(indicatorStatus ? ' active' : ' inactive')
    .concat(variant === 'imageBottom' ? ' blur' : '');

  return (
    <div
      ref={blockRef}
      className={`block ${variant === 'imageLeft' ? 'image-left' : variant === 'imageTop' ? 'image-top' : variant === 'imageBottom' ? 'image-bottom' : ''}`}
    >
      {variant === 'imageTop' && <img src={img} alt="placeholder" className="image" />}
      <div className="content" style={contentAlign ? { alignItems: contentAlign } : undefined}>
        {variant === 'imageLeft' && <img src={img} alt="placeholder" className="image" />}
        <p
          ref={textRef}
          className="text"
          style={{
            paddingTop: finalPaddingTop,
            paddingBottom: paddingBottom + extraPaddingTop,
          }}
        >
          <span ref={inlineRef}>{text}</span>
        </p>
      </div>
      {variant === 'imageBottom' && <img src={img} alt="placeholder" className="image" />}
      <div className={dotsClassName} style={{ top: variant === 'imageTop' ? 8 : 0 }}>
        <Dots />
      </div>
      {indicator > 0 && (
        <span className={indicatorClassName} style={{ transform: `translateY(0px)` }}>
          {(indicatorStatus ? '+' : '') + indicator}
        </span>
      )}
    </div>
  );
}
