import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SITE } from '../app.config';
import { CardService } from '../card/services/card.service';
import { AlertService } from '../shared/components/alert/alert.service';
import {
    CollectionSelectorComponent,
    CollectionSelectorData,
    CollectionSelectorResult,
} from '../shared/components/collection-selector/collection-selector.component';
import { CardInput, Site, UserRole } from '../shared/generated-types';
import { NetworkActivityService } from '../shared/services/network-activity.service';
import { ThemeService } from '../shared/services/theme.service';
import { UserService } from '../users/services/user.service';
import { UserComponent } from '../users/user/user.component';

function isExcel(file: File): boolean {
    return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

    public Site = Site;

    public errors = [];
    public user;
    public nav = 1;
    private routeParamsSub;

    constructor(public themeService: ThemeService,
                public route: ActivatedRoute,
                public router: Router,
                public userService: UserService,
                private network: NetworkActivityService,
                private snackBar: MatSnackBar,
                private alertService: AlertService,
                private dialog: MatDialog,
                private cardService: CardService,
                @Inject(SITE) public site: Site) {

        this.network.errors.next([]);
    }

    ngOnDestroy() {
        this.routeParamsSub.unsubscribe();
    }

    ngOnInit() {
        // Watch errors
        this.network.errors.subscribe(errors => {
            this.errors = this.errors.concat(errors);
        });

        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;
        });

        this.routeParamsSub = this.route.firstChild.params.subscribe(params => {
            if (params.nav && /^[01]$/.test(params.nav)) {
                this.nav = +params.nav;
            }
        });

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                document.querySelectorAll('.mat-sidenav-content, .scrollable').forEach(i => i.scroll({top: 0}));
            });

    }

    public uploadImages(files: File[]): void {
        const excel = files.find(isExcel);
        if (excel) {
            this.uploadImagesAndExcel(excel, files.filter(f => !isExcel(f)));
        } else {
            this.uploadImagesOnly(files);
        }

        files.length = 0;
    }

    public uploadImagesOnly(files: File[]): void {
        const inputs = files.map(file => {
            const card = this.cardService.getConsolidatedForClient();
            card.file = file;

            return card;
        });
        files.length = 0;

        const requireCollection = this.site === Site.tiresias;
        const collection$ = requireCollection ? this.selectCollection() : of(undefined);
        collection$.subscribe(collection => {

            // Don't do anything if don't have a required collection
            if (requireCollection && !collection) {
                return;
            }

            const observables = inputs.map(input => this.cardService.createWithCollection(input as CardInput, collection));

            forkJoin(observables).subscribe(() => {
                this.redirectAfterCreation(collection);
            });
        });
    }

    public uploadImagesAndExcel(excel: File, images: File[]): void {
        this.selectCollection().subscribe(collection => {
            this.cardService.createWithExcel(excel, images, collection).subscribe(() => {
                this.redirectAfterCreation(collection);
            });
        });
    }

    private redirectAfterCreation(collection?: CollectionSelectorResult) {
        const url = collection ? 'my-collection/' + collection.id : 'my-collection';
        this.router.navigateByUrl('/empty', {skipLocationChange: true})
            .then(() => this.router.navigateByUrl(url));
    }

    private selectCollection(): Observable<CollectionSelectorResult | undefined> {
        return this.dialog.open<CollectionSelectorComponent, CollectionSelectorData, CollectionSelectorResult>(
            CollectionSelectorComponent,
            {
                width: '400px',
                data: {},
            },
        ).afterClosed();
    }

    public editUser() {
        this.userService.getCurrentUser().subscribe(user => {
            this.dialog.open(UserComponent, {
                width: '800px',
                data: {item: user},
            });
        });
    }

    public showNavigationMenu() {
        return !!this.nav;
    }

    public showThesaurusMenu() {

        const dilpsRoles = [UserRole.administrator, UserRole.senior, UserRole.major, UserRole.junior];
        const tiresiasRoles = [UserRole.administrator];
        const applicableRoles = this.site === Site.dilps ? dilpsRoles : tiresiasRoles;

        return applicableRoles.includes(this.user.role);
    }

}
