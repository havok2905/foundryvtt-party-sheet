import {
  FLAG_MODULE_KEY,
  PARTY_SHEET_TEMPLATE_PATH
} from '../constants';

interface PartySheetForm {
  cp: number;
  ep: number;
  gp: number;
  location: string;
  name: string;
  pp: number;
  reputationNameA: string;
  reputationNameB: string;
  reputationNameC: string;
  reputationNameD: string;
  reputationNameE: string;
  reputationValueA: string;
  reputationValueB: string;
  reputationValueC: string;
  reputationValueD: string;
  reputationValueE: string;
  sp: number;
}

export class PartySheet extends ActorSheet {
  itemClassName: string;
  itemCreateClassName: string;
  itemCreateIconClassName: string;
  itemDeleteClassName: string;
  itemDeleteIconClassName: string;
  itemEditClassName: string;
  itemEditIconClassName: string;
  itemImageClassName: string;
  itemNameClassName: string;
  itemNameHeaderClassName: string;
  itemSummaryClassName: string;
  itemSummaryOpenClassName: string;

  constructor(object, options) {
    super(object, options);
    this.itemClassName = 'item';
    this.itemCreateClassName = 'item-create';
    this.itemCreateIconClassName = 'item-create-icon';
    this.itemDeleteClassName = 'item-delete';
    this.itemDeleteIconClassName = 'item-delete-icon';
    this.itemEditClassName = 'item-edit';
    this.itemEditIconClassName = 'item-edit-icon';
    this.itemImageClassName = 'item-image';
    this.itemNameClassName = 'item-name';
    this.itemNameHeaderClassName = 'item-name-header';
    this.itemSummaryClassName = 'item-summary';
    this.itemSummaryOpenClassName = 'item-summary-open';
  }

  get template(): string {
    return PARTY_SHEET_TEMPLATE_PATH;
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    
    mergeObject(options, {
      classes: ['actor dnd5e npc npc-sheet sheet']
    });

    return options;
  }

  private handleItemCreateClick(target: HTMLElement): void {
    if(
      !target.classList.contains(this.itemCreateClassName) &&
      !target.classList.contains(this.itemCreateIconClassName)
    ) {
      return;
    }

    let el: HTMLElement | null;

    /**
     * We need to start our move up the DOM tree from the same place.
     * Because this event can fire from multiple nested elements, we need
     * to force a starting point for the traversal to work.
     */
    if (target.classList.contains(this.itemCreateIconClassName)) {
      el = target.parentElement;
    } else {
      el = target;
    }

    const name = el?.dataset.name;
    const type = el?.dataset.type;

    this.actor.createEmbeddedDocuments("Item", [{name, type}]);
  }

  private handleItemDeleteClick(target: HTMLElement): void {
    if(
      !target.classList.contains(this.itemDeleteClassName) &&
      !target.classList.contains(this.itemDeleteIconClassName)
    ) {
      return;
    }

    let el: HTMLElement | null;

    /**
     * We need to start our move up the DOM tree from the same place.
     * Because this event can fire from multiple nested elements, we need
     * to force a starting point for the traversal to work.
     */
    if (target.classList.contains(this.itemDeleteIconClassName)) {
      el = target.parentElement;
    } else {
      el = target;
    }

    const id = el?.dataset.itemId ?? '';

    const item = this.actor.items.get(id);

    item?.delete();
  }

  private handleItemEditClick(target: HTMLElement): void {
    if(
      !target.classList.contains(this.itemEditClassName) &&
      !target.classList.contains(this.itemEditIconClassName)
    ) {
      return;
    }

    let el: HTMLElement | null;

    /**
     * We need to start our move up the DOM tree from the same place.
     * Because this event can fire from multiple nested elements, we need
     * to force a starting point for the traversal to work.
     */
    if (target.classList.contains(this.itemEditIconClassName)) {
      el = target.parentElement;
    } else {
      el = target;
    }

    const id = el?.dataset.itemId ?? '';

    const item = this.actor.items.get(id);

    item?.sheet?.render(true);
  }

  private handleItemImageClick(target: HTMLElement): void {
    if (!target.classList.contains(this.itemImageClassName)) {
      return;
    }

    const id = target.dataset.itemId ?? '';

    /**
     * The use method absolutely exists on type Item,
     * but the roll() method is deprecated in favor
     * of use. I assume the type or interface hasn't
     * been updated yet.
     */
    // @ts-ignore
    this.actor.items.get(id)?.use();
  }

  private handleItemNameClick(target: HTMLElement): void {
    // Break if we are not an item-name or item-name-header
    if (
      !target.classList.contains(this.itemNameClassName) &&
      !target.classList.contains(this.itemNameHeaderClassName)) {
      return;
    }

    // Break if we are a use of item-name outside of an item container
    const parentIsItem = target.parentElement?.classList.contains(this.itemClassName);
    if (
      target.classList.contains(this.itemImageClassName) &&
      !parentIsItem
    ) {
      return;
    }

    let el: HTMLElement | null;
    
    /**
     * We need to start our move up the DOM tree from the same place.
     * Because this event can fire from multiple nested elements, we need
     * to force a starting point for the traversal to work.
     */
    if (target.classList.contains(this.itemNameHeaderClassName)) {
      el = target.parentElement;
    } else {
      el = target;
    }

    const itemElement = el!.parentElement;
    const itemSummaryElement = itemElement!.getElementsByClassName(this.itemSummaryClassName)[0];

    if (itemSummaryElement.classList.contains(this.itemSummaryOpenClassName)) {
      itemSummaryElement.classList.remove(this.itemSummaryOpenClassName);
    } else {
      itemSummaryElement.classList.add(this.itemSummaryOpenClassName);
    }
  }

  activateListeners(html: JQuery<HTMLElement>): void {
    html.on('click', (event) => {
      const target = event.target;
      this.handleItemCreateClick(target);
      this.handleItemDeleteClick(target);
      this.handleItemEditClick(target);
      this.handleItemImageClick(target);
      this.handleItemNameClick(target);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getData(): any {
    const data = super.getData();

    //@ts-ignore
    const playerCharacters = game.actors.filter(entry => {
      return entry.hasPlayerOwner;
    });

    const cp = this.actor.getFlag(FLAG_MODULE_KEY, 'cp') ?? 0;
    const ep = this.actor.getFlag(FLAG_MODULE_KEY, 'ep') ?? 0;
    const gp = this.actor.getFlag(FLAG_MODULE_KEY, 'gp') ?? 0;
    const location = this.actor.getFlag(FLAG_MODULE_KEY, 'location') ?? '';
    const pp = this.actor.getFlag(FLAG_MODULE_KEY, 'pp') ?? 0;
    const reputationNameA = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationNameA') ?? '';
    const reputationNameB = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationNameB') ?? '';
    const reputationNameC = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationNameC') ?? '';
    const reputationNameD = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationNameD') ?? '';
    const reputationNameE = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationNameE') ?? '';
    const reputationValueA = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationValueA') ?? 0;
    const reputationValueB = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationValueB') ?? 0;
    const reputationValueC = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationValueC') ?? 0;
    const reputationValueD = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationValueD') ?? 0;
    const reputationValueE = this.actor.getFlag(FLAG_MODULE_KEY, 'reputationValueE') ?? 0;
    const sp = this.actor.getFlag(FLAG_MODULE_KEY, 'sp') ?? 0;

    const consumables = this.actor.items.filter(item => item.type === 'consumable');
    const containers = this.actor.items.filter(item => item.type === 'backpack');
    const equipment = this.actor.items.filter(item => item.type === 'equipment');
    const loot = this.actor.items.filter(item => item.type === 'loot');
    const tools = this.actor.items.filter(item => item.type === 'tool');
    const weapons = this.actor.items.filter(item => item.type === 'weapon');

    const items = [
      { name: 'Weapons', newItemName: 'New Weapon', type: 'weapon', collection: weapons },
      { name: 'Equipment', newItemName: 'New Equipment', type: 'equipment', collection: equipment },
      { name: 'Consumables', newItemName: 'New Consumable', type: 'consumable', collection: consumables },
      { name: 'Tools', newItemName: 'New Tool', type: 'tool', collection: tools },
      { name: 'Containers', newItemName: 'New Container', type: 'backpack', collection: containers },
      { name: 'Loot', newItemName: 'New Loot', type: 'loot', collection: loot }
    ];

    return {
      ...data,
      cp,
      ep,
      gp,
      items,
      location,
      playerCharacters,
      pp,
      reputationNameA,
      reputationNameB,
      reputationNameC,
      reputationNameD,
      reputationNameE,
      reputationValueA,
      reputationValueB,
      reputationValueC,
      reputationValueD,
      reputationValueE,
      sp
    };
  }

  async _updateObject(_event: Event, form: PartySheetForm): Promise<void> {
    const {
      cp,
      ep,
      gp,
      location,
      name,
      pp,
      reputationNameA,
      reputationNameB,
      reputationNameC,
      reputationNameD,
      reputationNameE,
      reputationValueA,
      reputationValueB,
      reputationValueC,
      reputationValueD,
      reputationValueE,
      sp,
    } = form;

    const objectData = {name};

    const flagsData = {
      flags: {
        [FLAG_MODULE_KEY]: {
          cp,
          ep,
          gp,
          location,
          pp,
          reputationNameA,
          reputationNameB,
          reputationNameC,
          reputationNameD,
          reputationNameE,
          reputationValueA,
          reputationValueB,
          reputationValueC,
          reputationValueD,
          reputationValueE,
          sp
        }
      }
    };

    await this.object.update(objectData);
    await this.actor.update(flagsData);
  }
}
