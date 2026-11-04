import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Navbar from './Navbar';

describe('navigation drawer accessibility', () => {
  it('moves focus into the drawer, closes on Escape and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(
      <Navbar
        activeTab="basics"
        onSelectTab={vi.fn()}
        selectedTerritoryId="normal"
        onSelectTerritory={vi.fn()}
        currentThemeId="dark-navy"
        onSelectTheme={vi.fn()}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Open Navigation & Themes Menu' });
    trigger.focus();
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'ECG Simulator Menu' });
    const closeButton = screen.getByRole('button', { name: 'Close Menu' });
    expect(dialog).toBeInTheDocument();
    expect(closeButton).toHaveFocus();
    expect(screen.getAllByText('v6.4')).toHaveLength(2);
    expect(screen.getByText('Release v6.4')).toBeInTheDocument();

    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'ECG Simulator Menu' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
