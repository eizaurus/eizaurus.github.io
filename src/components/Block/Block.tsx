// components/Block/Block.tsx
import { useEffect, useRef, useState } from 'react';
import './Block.css';
import { Dots } from '../../assets';
import clsx from 'clsx';


interface BlockProps {
  id: string;
  text: string;
  indicator: number;
  indicatorStatus: boolean;
  variant: 'text' | 'imageLeft' | 'imageTop' | 'imageBottom';
  img?:string|undefined;
  /* onChange: (data: { text?: string; indicator?: number; variant?: BlockProps['variant'] }) => void; */
}

export default function Block({ id,text, indicator,indicatorStatus,img, variant, /* onChange */ }: BlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const padding=16;
  const [indicatorOffset, setIndicatorOffset] = useState(0);

/* useEffect(() => {
  if (!textRef.current || !blockRef.current) return;

  const textEl = textRef.current;
  const lineHeight = parseFloat(getComputedStyle(textEl).lineHeight || '0');
  const rects = textEl.getClientRects();
  const lastRect = rects[rects.length - 1];

  if (lastRect) {
    const blockRect = blockRef.current.getBoundingClientRect();
    const overlap = lastRect.right + 50 > blockRect.right; // 50px — ширина индикатора
    setIndicatorOffset(overlap ? lineHeight : 12);
  }
}, [text, indicator]); */
useEffect(() => {
  if (!textRef.current || !blockRef.current) return;

  const textEl = textRef.current;
  const blockEl = blockRef.current;

  const lineHeight = parseFloat(getComputedStyle(textEl).lineHeight || '0');
  const rects = textEl.getClientRects();
  if (!rects.length) return;

  const lastRect = rects[rects.length - 1];
  const blockRect = blockEl.getBoundingClientRect();

  const indicatorEl = blockEl.querySelector('.indicator') as HTMLElement;
  if (!indicatorEl) return;

  const indicatorWidth = indicatorEl.getBoundingClientRect().width;

  const spaceToRight = blockRect.right - lastRect.right;
  if(id=='2'||id=='1'){
    console.log('id',id)
    console.log('lineHeight',lineHeight)
    console.log('indicatorWidth',indicatorWidth)
    console.log('spaceToRight',spaceToRight)
    }
  if (spaceToRight < indicatorWidth+14) {
    setIndicatorOffset(lineHeight); 
  } else {
    setIndicatorOffset(12); // обычный отступ
  }
}, [text, indicator]);

  const dotsClassName=clsx("dots",variant==='imageTop'&&' blur')
  const indicatorClassName='indicator'.concat(indicatorStatus?' active':' inactive',variant==='imageBottom'?' blur':'');
  const v=['text', 'imageLeft'];
  
  return (
<div
  ref={blockRef}
  className={`block ${variant === 'imageLeft' ? 'image-left' : variant === 'imageTop' ? 'image-top' : variant === 'imageBottom' ? 'image-bottom' : ''}`}
  
>
  {variant === 'imageTop' && (
    <img src={img} alt="placeholder" className="image" />
  )}
  <div className="content">
  {variant === 'imageLeft'&& (
    <img src={img} alt="placeholder" className="image" />
  )}
  <p ref={textRef} className="text" style={{ paddingBlock: v.includes(variant)? padding:0}}>
    {text}
  </p>
  </div>
  {variant === 'imageBottom' && (
    <img src={img} alt="placeholder" className="image" />
  )}
  <div className={dotsClassName}><Dots/></div>
  {indicator > 0 && (
    <span className={indicatorClassName} style={{ transform: `translateY(${indicatorOffset}px)` }}>
      {(indicatorStatus ? '+' : '') + indicator}
    </span>
  )}
</div>

  );
}
