import { TestBed } from '@angular/core/testing';
import { MigNode } from '../../../../core/api';
import { MigTreeState } from '../../mig-tree-state.service';
import { MigTreeNodeComponent } from './mig-tree-node.component';

const node: MigNode = {
  type: 'segment_group',
  key: 'SG4',
  name: 'Vorgang',
  statusStd: 'M',
  statusSpecification: 'M',
  children: [
    {
      type: 'segment',
      key: 'IDE',
      name: 'Vorgang',
      statusStd: 'M',
      statusSpecification: 'M',
      children: [],
    },
  ],
};

describe('MigTreeNodeComponent', () => {
  let state: MigTreeState;
  let root: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MigTreeNodeComponent],
      providers: [MigTreeState],
    });
    const fixture = TestBed.createComponent(MigTreeNodeComponent);
    fixture.componentRef.setInput('node', node);
    fixture.detectChanges();
    state = TestBed.inject(MigTreeState);
    root = fixture.nativeElement;
  });

  const expander = () => root.querySelector('button') as HTMLButtonElement;
  const item = () => root.querySelector('[role="treeitem"]') as HTMLElement;
  const key = (target: HTMLElement, k: string) => {
    const event = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
  };

  it('toggles once from the expander: its Enter/Space keydown does not reach the row', () => {
    key(expander(), ' ');
    key(expander(), 'Enter');
    expect(state.expanded().has(node)).toBe(false); // only the native click toggles
    expander().click();
    expect(state.expanded().has(node)).toBe(true);
  });

  it('toggles with Space on the row without scrolling the page', () => {
    const event = key(item(), ' ');
    expect(state.expanded().has(node)).toBe(true);
    expect(event.defaultPrevented).toBe(true);
  });
});
