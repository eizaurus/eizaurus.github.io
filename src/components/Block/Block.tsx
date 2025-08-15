// components/Block/Block.tsx
import { useLayoutEffect, useRef, useState } from 'react';
import './Block.css';
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

export default function Block({
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
  /* const paddingBase = 16; */

  const [indicatorOffset, setIndicatorOffset] = useState(0);
/*   const [indicatorJumped, setIndicatorJumped] = useState(false); */
  const [dotsPaddingTop, setDotsPaddingTop] = useState(0);
  const [linesCount, setLinesCount] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!inlineRef.current || !textRef.current || !blockRef.current) return;

      const textEl = textRef.current;
      const blockEl = blockRef.current;

      const style = getComputedStyle(textEl);
      const lineHeight = parseFloat(style.lineHeight || '0') || textEl.clientHeight; // fallback

      // range по inline span — rect'ы соответствуют визуальным линиям
      const range = document.createRange();
      range.selectNodeContents(inlineRef.current);
      const rects = Array.from(range.getClientRects());
      if (!rects.length) {
        setLinesCount(0);
        setIndicatorOffset(12);
        /* setIndicatorJumped(false); */
        setDotsPaddingTop(0);
        return;
      }

      const firstRect = rects[0];
      const lastRect = rects[rects.length - 1];
      const lines = rects.length;
      setLinesCount(lines);

      const blockRect = blockEl.getBoundingClientRect();

      // индикатор: реальная ширина
      const indicatorEl = blockEl.querySelector('.indicator') as HTMLElement | null;
      const indicatorWidth = indicatorEl?.getBoundingClientRect().width ?? 0;

      const spaceToRight = blockRect.right - lastRect.right;

      // Новая логика:
      // - для imageLeft: прыжок разрешаем ТОЛЬКО если видимых строк >= 3 и есть нехватка места справа
      // - для остальных (кроме imageBottom): прежняя логика (если не хватает места справа)
      let shouldJump = false;
      if (variant === 'imageLeft') {
        shouldJump = lines >= 3 && spaceToRight < indicatorWidth + 14;
      } else {
        shouldJump = variant !== 'imageBottom' && spaceToRight < indicatorWidth + 14;
      }

      // устанавливаем смещение индикатора (прыжок = высота строки) и флаг прыжка
      setIndicatorOffset(shouldJump ? lineHeight : 12);
      /* setIndicatorJumped(shouldJump); */

      // dots: проверим, не задевает ли верхняя строка область справа (где dots расположен)
      const dotsEl = blockEl.querySelector('.dots') as HTMLElement | null;
      if (dotsEl) {
        const dotsW = dotsEl.getBoundingClientRect().width;
        // расстояние от правого края первой строки до правого края блока
        const spaceRightFirstLine = blockRect.right - firstRect.right;
        setDotsPaddingTop(spaceRightFirstLine < dotsW + 4 ? lineHeight : 0);
      } else {
        setDotsPaddingTop(0);
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (blockRef.current) ro.observe(blockRef.current);

    // пересчитать после загрузки шрифтов — важно для корректных метрик
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => ro.disconnect();
  }, [text, indicator, variant, id]);

  // effectiveLines: учитываем corner-case: если 1 строка, но индикатор прыгнул — считаем как 2
  //const effectiveLines = linesCount === 1 && indicatorJumped ? 2 : linesCount;
const effectiveLines = linesCount;
  // Текстовые паддинги:
  // - variant === 'text': если effectiveLines === 1 => 24, иначе 16
  // - variant === 'imageLeft': всегда 16 (по заданию)
  // - другие варианты: сохраним прежние значения (fallback 16/0)
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
    // imageTop / imageBottom — оставляем прежние паддинги (в твоём оригинале paddingBottom зависел от needPadding)
    paddingTop = variant === 'imageTop'?8:16;
    paddingBottom = variant === 'imageBottom'?8:16;
  }

  // Если dots поставил paddingTop — суммируем (dotsPaddingTop либо 0 либо lineHeight).
  // Но dotsPaddingTop хранится в px; просто применим его to paddingTop (вместо overwrite)
  // Чтобы избежать конфликтов, используем Math.max — если dotsPaddingTop больше, возьмём его.
  const finalPaddingTop = Math.max(paddingTop, dotsPaddingTop || 0);

  // Для content (imageLeft): вертикальное выравнивание
  // - если imageLeft && effectiveLines <= 2 -> центрируем текст относительно картинки
  // - если imageLeft && effectiveLines >= 3 -> align-start (текст идёт вверх и может продолжаться под картинкой)
  const contentAlign =
    variant === 'imageLeft' ? (effectiveLines <= 2 ? 'center' : 'flex-start') : undefined;

  const dotsClassName = clsx('dots', variant === 'imageTop' && 'blur');
  const indicatorClassName = 'indicator'
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
          // paddingTop и paddingBottom — динамически
          style={{
            paddingTop: finalPaddingTop,
            paddingBottom,
            // если variant === imageLeft и текст центруется, даем вертикальный margin в обход внутренних стилей (необязательно)
          }}
        >
          <span ref={inlineRef}>{text}</span>
        </p>
      </div>
      {variant === 'imageBottom' && <img src={img} alt="placeholder" className="image" />}
      <div className={dotsClassName}style={{ top: variant === 'imageTop'?8:0 }}>
        <Dots />
      </div>
      {indicator > 0 && (
        <span className={indicatorClassName} style={{ transform: `translateY(${indicatorOffset}px)` }}>
          {(indicatorStatus ? '+' : '') + indicator}
        </span>
      )}
    </div>
  );
}
