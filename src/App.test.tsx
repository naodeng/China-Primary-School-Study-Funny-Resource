import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('renders catalog and opens settings', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: '星岛学习站' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '设置' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '显示主题' })).toBeInTheDocument();
  });

  it('updatesTheCurrentPageWhenBrowserHistoryChanges', () => {
    render(<App />);

    act(() => {
      window.history.pushState({}, '', '/grade-2/term-1/chinese/unit-01');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByRole('heading', { name: '第一单元 · 大自然的秘密' })).toBeInTheDocument();
    expect(screen.getByText(/本课程依据 TapXWorld 固定快照/)).toBeInTheDocument();
  });
});
