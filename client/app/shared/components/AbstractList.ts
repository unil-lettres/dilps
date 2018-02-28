import { ActivatedRoute, Router } from '@angular/router';
import { IncrementSubject } from '../services/increment-subject';
import { MatDialog } from '@angular/material';
import { PaginatedDataSource } from '../services/paginated.data.source';
import { OnInit } from '@angular/core';

export class AbstractList implements OnInit {

    public displayedColumns = [
        'name',
    ];
    public dataSource;

    protected listingOptions = new IncrementSubject({});

    constructor(private key,
                private service,
                private component,
                private router: Router,
                private route: ActivatedRoute,
                private dialog: MatDialog) {
    }

    ngOnInit() {

        const queryRef = this.service.watchAll(this.listingOptions);
        this.dataSource = new PaginatedDataSource(
            queryRef.valueChanges,
            this.listingOptions,
            {},
            true,
            this.router,
            this.route,
            this.key,
        );
    }

    public edit(item) {
        this.dialog.open(this.component, {
            width: '800px',
            data: {item: item},
        });
    }

    public add() {
        this.dialog.open(this.component, {
            width: '800px',
        });
    }
}