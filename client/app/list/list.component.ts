import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../card/services/card.service';
import { merge } from 'lodash';
import { IncrementSubject } from '../shared/services/increment-subject';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { MatDialog } from '@angular/material';
import { CollectionSelectorComponent } from '../shared/components/collection-selector/collection-selector.component';
import { CollectionService } from '../collections/services/collection.service';
import { AlertService } from '../shared/components/alert/alert.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

    @ViewChild('gallery') gallery;
    @ViewChild('scrollable') private scrollable: PerfectScrollbarComponent;

    public galleryCollection = null;
    public options = null;
    public selected;

    public showLogo = true;

    private thumbnailHeight = 400;
    private enlargedHeight = 2000;
    private sub;

    private queryVariables = new IncrementSubject({});

    constructor(private router: Router,
                private route: ActivatedRoute,
                private cardSvc: CardService,
                private dialog: MatDialog,
                private collectionSvc: CollectionService,
                private alertSvc: AlertService) {
    }

    ngOnInit() {

        this.route.data.subscribe(data => this.showLogo = data.showLogo);

        this.route.params.subscribe(params => {
            if (params.collectionId) {
                this.galleryCollection = [];
                this.queryVariables.patch({filters: {collections: [params.collectionId]}});
            }
        });

        this.options = {
            margin: 5,
            showLabels: 'true',
            rowHeight: this.thumbnailHeight,
        };

    }

    private formatImages(cards) {

        cards = cards.map(card => {
            let thumb = CardService.formatImage(card, this.thumbnailHeight);
            let big = CardService.formatImage(card, this.enlargedHeight);

            thumb = {
                thumbnail: thumb.src,
                tWidth: thumb.width,
                tHeight: thumb.height,
            };

            big = {
                enlarged: big.src,
                eWidth: big.width,
                eHeight: big.height,
            };

            const fields = {
                link: 'true',
                title: card.name ? card.name : 'Voir le détail',
            };

            return merge({}, card, thumb, big, fields);
        });

        return cards;
    }

    public activate(item) {
        this.router.navigate([
            'card',
            item.id,
        ]);
    }

    public select(items) {
        this.selected = items;

    }

    public loadMore(ev) {

        this.queryVariables.patch({
            pagination: {
                offset: ev.offset,
                pageSize: ev.limit,
            },
        });

        if (!this.sub) {
            this.sub = this.cardSvc.watchAll(this.queryVariables);
            this.sub.valueChanges.subscribe(data => {
                this.gallery.addItems(this.formatImages(data.items));
            });
        }
    }

    public linkToCollection(selection) {

        this.dialog.open(CollectionSelectorComponent, {
            width: '400px',
            data: {
                images: selection,
            },
        });
    }

    public unlinkFromCollection(selection) {
        const collection = {
            id: this.route.snapshot.params.collectionId,
            __typename: 'Collection',
        };
        this.collectionSvc.unlink(collection, selection).subscribe(() => {
            this.alertSvc.info('Les images ont été retirées');
            this.sub.refetch();
        });
    }

    public delete(selection) {
        console.log(selection);
        this.alertSvc.confirm('Suppression', 'Voulez-vous supprimer définitivement cet/ces élément(s) ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.cardSvc.delete(selection).subscribe(() => {
                        this.alertSvc.info('Supprimé');
                        this.sub.refetch();
                    });
                }
            });
    }
}
