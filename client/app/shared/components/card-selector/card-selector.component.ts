import {Component, OnInit} from '@angular/core';
import {CardService} from '../../../card/services/card.service';
import {Cards_cards_items} from '../../generated-types';

@Component({
    selector: 'app-card-selector',
    templateUrl: './card-selector.component.html',
    styleUrls: ['./card-selector.component.scss'],
})
export class CardSelectorComponent implements OnInit {
    public card: Cards_cards_items | null;

    constructor(public readonly cardService: CardService) {}

    public ngOnInit(): void {}

    public displayWith(item: Cards_cards_items | string): string {
        return item && typeof item !== 'string' ? item.name + ' (' + item.id + ')' : '';
    }
}
