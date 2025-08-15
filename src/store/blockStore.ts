import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const blockSchema = z.object({
  id: z.string(),
  text: z.string(),
  indicator: z.number().min(0).max(9999),
  indicatorStatus: z.boolean(),
  variant: z.enum(['text', 'imageLeft', 'imageTop', 'imageBottom']),
  image: z.string().optional(),
});

export type BlockType = z.infer<typeof blockSchema>;

interface BlocksStore {
  blocks: BlockType[];
  addBlock: (block: BlockType) => void;
  updateBlock: (id: string, data: Partial<BlockType>) => void;
  removeBlock: (id: string) => void;
}

export const useBlocksStore = create<BlocksStore>()(
  persist(
    (set, get) => ({
      blocks: [{
        id: '1',
        text: "Drinking water isn't just about quenching",
        indicator: 1,
        indicatorStatus: false,
        variant: 'text',
      },{
        id: '2',
        text: "Drinking water isn't just about quenching your thirst. It plays a crucial role in about quenching bbbbbbbb",
        indicator: 100,
        indicatorStatus: false,
        variant: 'text',
      }, {
        id: '3',
        text: "Drinking water isn't just about quenching your thirst. It plays a crucial role in maintaining the proper functioning of your ",
        indicator: 10,
        indicatorStatus: true,
        variant: 'text',
      }, {
        id: '4',
        text: "Drinking water isn't just about quenching your thirst. It plays a crucial role in maintaining the proper functioning of your body, and staying properly hydrated is vital ",
        indicator: 0,
        indicatorStatus: false,
        variant: 'text',
      }, {
        id: '5',
        text: "quenching your thirst. It plays a cru",
        indicator: 10,
        indicatorStatus: false,
        variant: 'imageLeft',
        image: '/1.jpg',

      }, {
        id: '6',
        text: "Drinking water isn't just about quenching your thirst. It plays a cru bbb",
        indicator: 10,
        indicatorStatus: false,
        variant: 'imageLeft',
        image: '/1.jpg',

      }, {
        id: '7',
        text: "Drinking water isn't just about quenching your thirst. It plays a crucial role in  in maintaining the a bbbbbbbbb",
        indicator: 10,
        indicatorStatus: false,
        variant: 'imageLeft',
        image: '/1.jpg',

      }, {
        id: '8',
        text: "Drinking water isn't just about quenching your thirst. It plays a crucial role in maintaining the proper functioning of your body a bbbbbbbbb",
        indicator: 10,
        indicatorStatus: false,
        variant: 'imageLeft',
        image: '/1.jpg',
      }, {
        id: '9',
        text: "Drinking water isn't just about quenching aaa bbbb",
        indicator: 10,
        indicatorStatus: false,
        variant: 'imageTop',
        image: '/2.jpg',
      }, {
        id: '10',
        text: "Hello world!",
        indicator: 10,
        indicatorStatus: false,
        variant: 'imageBottom',
        image: '/3.jpg',
      }],
      addBlock: (block) => set({ blocks: [...get().blocks, block] }),
      updateBlock: (id, data) =>
        set({
          blocks: get().blocks.map((b) => (b.id === id ? { ...b, ...data } : b)),
        }),
      removeBlock: (id) =>
        set({ blocks: get().blocks.filter((b) => b.id !== id) }),
    }),
    {
      name: 'blocks-storage', // ключ localStorage
    }
  )
);
