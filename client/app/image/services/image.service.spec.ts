import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockApolloProvider } from '../../shared/testing/MockApolloProvider';
import { AbstractModelServiceSpec } from '../../shared/testing/AbstractModelServiceSpec';
import { userMetaTesting } from '../../shared/testing/userMetaTesting';
import { ImageService } from './image.service';

describe('ImageService', () => {

    const expectedOne = {
        id: '456',
        name: 'test string',
        expandedName: 'test string',
        height: 1,
        width: 1,
        isPublic: true,
        dating: 'test string',
        artists: [
            {
                id: '456',
                name: 'test string',
                __typename: 'Artist',
            },
            {
                id: '456',
                name: 'test string',
                __typename: 'Artist',
            },
        ],
        institution: {
            id: '456',
            name: 'test string',
            __typename: 'Institution',
        },
        type: 'image',
        status: 'new',
        original: {
            width: 1,
            height: 1,
            __typename: 'Image',
        },
        addition: 'test string',
        material: 'test string',
        technique: 'test string',
        techniqueAuthor: 'test string',
        format: 'test string',
        literature: 'test string',
        page: 'test string',
        figure: 'test string',
        table: 'test string',
        isbn: 'test string',
        comment: 'test string',
        rights: 'test string',
        muserisUrl: 'test string',
        muserisCote: 'test string',
        __typename: 'Image',
        creationDate: '2018-01-18T11:43:31',
        creator: userMetaTesting,
        updateDate: '2018-01-18T11:43:31',
        updater: userMetaTesting,
    };

    const expectedOneForAll = {
        id: '456',
        name: 'test string',
        width: 1,
        height: 1,
        __typename: 'Image',
    };

    const expectedAll = {
        items: [
            expectedOneForAll,
            expectedOneForAll,
        ],
        pageSize: 1,
        pageIndex: 1,
        length: 1,
        __typename: 'ImagePagination',
    };

    const expectedCreate = {
        id: '456',
        creationDate: '2018-01-18T11:43:31',
        creator: userMetaTesting,
        __typename: 'Image',
    };

    const expectedUpdate = {
        updateDate: '2018-01-18T11:43:31',
        updater: userMetaTesting,
        __typename: 'Image',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
            ],
            providers: [
                ImageService,
                MockApolloProvider,
            ],
        });
    });

    AbstractModelServiceSpec.test(ImageService, expectedOne, expectedAll, expectedCreate, expectedUpdate);

});
