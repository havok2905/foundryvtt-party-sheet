
import {PartySheet} from './sheets';
import {PARTY_SHEET_TEMPLATE_PATH} from './constants';

Hooks.on('init', async () => {
  await loadTemplates([
    PARTY_SHEET_TEMPLATE_PATH
  ]);

  Actors.registerSheet('party-sheet', PartySheet, {
    label: 'Party',
    makeDefault: false,
    types: ['npc']
  });
});
