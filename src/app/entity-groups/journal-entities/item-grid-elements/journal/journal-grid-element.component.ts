import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import {
  AbstractListableElementComponent
} from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../core/shared/item.model';
import { JournalSearchResultGridElementComponent } from '../search-result-grid-elements/journal/journal-search-result-grid-element.component';

@listableObjectComponent('Journal', ViewMode.GridElement)
@Component({
    selector: 'ds-journal-grid-element',
    styleUrls: ['./journal-grid-element.component.scss'],
    templateUrl: './journal-grid-element.component.html',
    standalone: true,
    imports: [JournalSearchResultGridElementComponent]
})
/**
 * The component for displaying a grid element for an item of the type Journal
 */
export class JournalGridElementComponent extends AbstractListableElementComponent<Item> {
}
