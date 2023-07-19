import { describe, expect, it, vi } from 'vitest';

import HighlightText from '@/components/HighlightText/index.vue';
import { mount } from '@vue/test-utils';

// import { v4 } from 'uuid';

describe('HighlightText', () => {
  it('renders correctly', () => {
    const wrapper: any = mount(HighlightText, {
      props: {
        text: 'Hello world!',
        highlight: 'world'
      }
    });
    vi.mock('uuid', () => ({
      v4: vi.fn(() => 'mock-uuid')
    }));
    console.log(v4());
    expect(wrapper.html()).toContain(
      '<span><span>Hello </span><span style="color: rgb(255, 85, 0); font-weight: bold; font-size: 24px;">world</span><span>!</span></span>'
    );
    expect(wrapper.vm.parts).toEqual([
      { text: 'Hello ', highlight: false, key: v4() },
      { text: 'world', highlight: true, key: v4() },
      { text: '!', highlight: false, key: v4() }
    ]);
  });
});
