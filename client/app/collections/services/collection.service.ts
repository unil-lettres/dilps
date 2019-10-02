import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { forkJoin } from 'rxjs';
import {
    Collection,
    CollectionVariables,
    Collections,
    CollectionsVariables,
    CollectionVisibility,
    CreateCollection,
    CreateCollectionVariables,
    DeleteCollections,
    UpdateCollection,
    UpdateCollectionVariables,
} from '../../shared/generated-types';
import { LinkService } from '../../shared/services/link-mutation.service';

import {
    collectionQuery,
    collectionsQuery,
    createCollection,
    deleteCollections,
    linkCollectionToCollection,
    updateCollection,
} from './collectionQueries';

@Injectable({
    providedIn: 'root',
})
export class CollectionService
    extends NaturalAbstractModelService<Collection['collection'],
        CollectionVariables,
        Collections['collections'],
        CollectionsVariables,
        CreateCollection['createCollection'],
        CreateCollectionVariables,
        UpdateCollection['updateCollection'],
        UpdateCollectionVariables,
        DeleteCollections['deleteCollections']> {

    constructor(apollo: Apollo, private linkSvc: LinkService) {
        super(apollo,
            'collection',
            collectionQuery,
            collectionsQuery,
            createCollection,
            updateCollection,
            deleteCollections);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            name: '',
            description: '',
            isSource: false,
            sorting: 0,
            visibility: CollectionVisibility.private,
            institution: null,
        };
    }

    public link(collection, images) {
        const observables = [];
        images.forEach(image => {
            observables.push(this.linkSvc.link(collection, image));
        });

        return forkJoin(observables);
    }

    public unlink(collection, images) {
        const observables = [];
        images.forEach(image => {
            observables.push(this.linkSvc.unlink(collection, image));
        });

        return forkJoin(observables);
    }

    public linkCollectionToCollection(sourceCollection, targetCollection) {
        return this.apollo.mutate({
            mutation: linkCollectionToCollection,
            variables: {
                sourceCollection: sourceCollection.id,
                targetCollection: targetCollection.id,
            },
        });
    }
}
