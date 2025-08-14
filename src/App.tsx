// App.tsx
/* import { useState } from 'react'; */
import Block from './components/Block/Block';
import { useBlocksStore, /* BlockType */ } from './store/blockStore';
/* import { v4 as uuidv4 } from 'uuid'; */

/* type Variant='text' | 'imageLeft' | 'imageTop' | 'imageBottom'; */

export default function App() {
 const blocks = useBlocksStore((state) => state.blocks);
/*   const addBlock = useBlocksStore((state) => state.addBlock); */
 /*  const updateBlock = useBlocksStore((state) => state.updateBlock); */

/*   const [newText, setNewText] = useState('');
  const [newIndicator, setNewIndicator] = useState(0);
  const [newIndicatorStatus, setNewIndicatorStatus] = useState(false);
  const [newVariant, setNewVariant] = useState<Variant>('text'); */

/*   const handleAddBlock = () => {
    const block: BlockType = {
      id: uuidv4(),
      text: newText || 'Новый блок',
      indicator: newIndicator,
      indicatorStatus: newIndicatorStatus,
      variant: newVariant,
      image: '/placeholder.png',
    };
    addBlock(block);
    setNewText('');
    setNewIndicator(0);
    setNewIndicatorStatus(false);
    setNewVariant('text');
  }; */

  return (
    <div style={{ padding: '20px' }}>
    {/*  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={newText}
          placeholder="Текст блока"
          onChange={(e) => setNewText(e.target.value)}
        />
        <input
          type="number"
          value={newIndicator}
          min={0}
          max={9999}
          onChange={(e) => setNewIndicator(Number(e.target.value))}
        /><input
  type="checkbox"
  checked={newIndicatorStatus} // boolean
  onChange={(e) => setNewIndicatorStatus(e.target.checked)}
/>
        <select value={newVariant} onChange={(e) => setNewVariant(e.target.value as Variant)}>
          <option value="text">Только текст</option>
          <option value="imageLeft">Картинка слева</option>
          <option value="imageTop">Картинка сверху</option>
          <option value="imageBottom">Картинка снизу</option>
        </select>
        <button onClick={handleAddBlock}>Добавить блок</button>
      </div>
<h2>Блоки</h2> */}
<div className="col3">
      <div className='grid'>
        {blocks.filter(i=>i.variant==="text").map((block) => (
          <Block
            key={block.id}
            id={block.id}
            variant={block.variant}
            text={block.text}
            indicator={block.indicator}
            indicatorStatus={block.indicatorStatus}
            /* onChange={(data) => updateBlock(block.id, data)} */
          />
        ))}
      </div>
       <div className='grid'>
        {blocks.filter(i=>i.variant==="imageLeft").map((block) => (
          <Block
            key={block.id}
            id={block.id}
            variant={block.variant}
            text={block.text}
            indicator={block.indicator}
            img={block.image}
            indicatorStatus={block.indicatorStatus}
            /* onChange={(data) => updateBlock(block.id, data)} */
          />
        ))}
      </div>
       <div className='grid'>
        {blocks.filter(i=>i.variant!=="imageLeft"&&i.variant!=="text").map((block) => (
          <Block
            key={block.id}
            id={block.id}
            variant={block.variant}
            text={block.text}
            indicator={block.indicator}
            img={block.image}
            indicatorStatus={block.indicatorStatus}
            /* onChange={(data) => updateBlock(block.id, data)} */
          />
        ))}
      </div>
    </div>
    </div>
  );
}
