// App.tsx
import { useState } from 'react';
//import Block from './components/Block/Block';
import { useBlocksStore, BlockType } from './store/blockStore';
import { v4 as uuidv4 } from 'uuid';
import Block2 from './components/Block2/Block2';

type Variant = 'text' | 'imageLeft' | 'imageTop' | 'imageBottom';
const img = { 'text': undefined, 'imageLeft': '/1.jpg', 'imageTop': '/2.jpg', 'imageBottom': '/3.jpg' }
export default function App() {
  const blocks = useBlocksStore((state) => state.blocks);
  const addBlock = useBlocksStore((state) => state.addBlock);
  const [newText, setNewText] = useState('');
  const [newIndicator, setNewIndicator] = useState(0);
  const [newIndicatorStatus, setNewIndicatorStatus] = useState(false);
  const [newVariant, setNewVariant] = useState<Variant>('text');
  const [draftBlock, setDraftBlock] = useState<BlockType>({
    id: 'draft',
    text: '0000000000000000000000000000000000',
    indicator: 1,
    indicatorStatus: true,
    variant: 'text',
    image: '/placeholder.png',
  });
  const handleAddBlock = () => {
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
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={draftBlock.text}
          placeholder="Текст блока"
          onChange={(e) =>
            setDraftBlock({ ...draftBlock, text: e.target.value })
          }
        />
        <input
          type="number"
          value={draftBlock.indicator}
          min={0}
          max={9999}
          onChange={(e) =>
            setDraftBlock({ ...draftBlock, indicator: Number(e.target.value)>=0&&Number(e.target.value)<=9999?Number(e.target.value):9999 })
          }
        />
        <label >Активный?<input
          type="checkbox"
          checked={draftBlock.indicatorStatus}
          max={9999}
          onChange={(e) =>
            setDraftBlock({ ...draftBlock, indicatorStatus: e.target.checked })
          }
        /></label>
        <select
          value={draftBlock.variant}
          onChange={(e) =>
            setDraftBlock({ ...draftBlock, variant: e.target.value as Variant, image: img[e.target.value as Variant] as string })
          }
        >
          <option value="text">Только текст</option>
          <option value="imageLeft">Картинка слева</option>
          <option value="imageTop">Картинка сверху</option>
          <option value="imageBottom">Картинка снизу</option>
        </select>
        <button onClick={handleAddBlock}>Добавить блок</button>
      </div>
      <h2>Блок с дергающимся текстом,как в телеграме</h2>
      <div className="col3">
        {draftBlock.text!==''&&<Block2
          key={draftBlock.id}
          id={draftBlock.id}
          text={draftBlock.text}
          indicator={draftBlock.indicator}
          indicatorStatus={draftBlock.indicatorStatus}
          variant={draftBlock.variant}
          img={draftBlock.image}
        />}
      </div>
      <h2>Блоки как в фигме</h2>
      <div className="col3">
        <div className='grid'>
          {blocks.filter(i => i.variant === "text").map((block) => (
            <Block2
              key={block.id}
              id={block.id}
              variant={block.variant}
              text={block.text}
              indicator={block.indicator}
              indicatorStatus={block.indicatorStatus}
            />
          ))}
        </div>
        <div className='grid'>
          {blocks.filter(i => i.variant === "imageLeft").map((block) => (
            <Block2
              key={block.id}
              id={block.id}
              variant={block.variant}
              text={block.text}
              indicator={block.indicator}
              img={block.image}
              indicatorStatus={block.indicatorStatus}
            />
          ))}
        </div>
        <div className='grid'>
          {blocks.filter(i => i.variant !== "imageLeft" && i.variant !== "text").map((block) => (
            <Block2
              key={block.id}
              id={block.id}
              variant={block.variant}
              text={block.text}
              indicator={block.indicator}
              img={block.image}
              indicatorStatus={block.indicatorStatus} />
          ))}
        </div>
      </div>
    </div>
  );
}
