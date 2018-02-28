import { ArtistComponent } from '../../artists/artist/artist.component';
import { AlertService } from './alert/alert.service';
import { MatDialogRef } from '@angular/material';
import { OnInit } from '@angular/core';
import { merge } from 'lodash';

export class AbstractDetail implements OnInit {

    public data: any = {
        item: {},
    };

    constructor(public service,
                private alertSvc: AlertService,
                public dialogRef: MatDialogRef<ArtistComponent>,
                data: any) {

        this.data = merge({item: this.service.getEmptyObject()}, data);
    }

    ngOnInit() {
        if (this.data.item.id) {
            this.service.getOne(this.data.item.id).subscribe(res => {
                merge(this.data.item, res); // init all fields considering getOne query
            });
        }
    }

    public update() {
        this.service.update(this.data.item).subscribe(() => {
            this.alertSvc.info('Mis à jour');
            this.dialogRef.close(this.data.item);
        });
    }

    public create() {
        this.service.create(this.data.item).subscribe(() => {
            this.alertSvc.info('Créé');
            this.dialogRef.close(this.data.item);
        });
    }

    public delete() {
        this.alertSvc.confirm('Suppression', 'Voulez-vous supprimer définitivement cet élément ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.service.delete(this.data.item).subscribe(() => {
                        this.alertSvc.info('Supprimé');
                        this.dialogRef.close(null);
                    });
                }
            });
    }
}