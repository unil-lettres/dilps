import gql from 'graphql-tag';
import {institutionDetails} from '../../institutions/services/institution.queries';
import {userMetaFragment} from '../../shared/queries/fragments';

const userDetailsFragment = gql`
    fragment userDetails on User {
        id
        email
        name
        login
        activeUntil
        role
        termsAgreement
        type
        institution {
            id
            name
        }
        creationDate
        creator {
            ...userMeta
        }
        updateDate
        updater {
            ...userMeta
        }
        permissions {
            update
            delete
        }
    }
    ${userMetaFragment}
`;

export const usersQuery = gql`
    query Users($filter: UserFilter, $sorting: [UserSorting!], $pagination: PaginationInput) {
        users(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                login
                name
                email
                role
                type
                activeUntil
                termsAgreement
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const userQuery = gql`
    query User($id: UserID!) {
        user(id: $id) {
            ...userDetails
        }
    }
    ${userDetailsFragment}
`;

export const createUser = gql`
    mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateUser = gql`
    mutation UpdateUser($id: UserID!, $input: UserPartialInput!) {
        updateUser(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
            institution {
                ...institutionDetails
            }
        }
    }
    ${userMetaFragment}
    ${institutionDetails}
`;

export const deleteUsers = gql`
    mutation DeleteUsers($ids: [UserID!]!) {
        deleteUsers(ids: $ids)
    }
`;

export const loginMutation = gql`
    mutation Login($login: Login!, $password: String!) {
        login(login: $login, password: $password) {
            ...userDetails
        }
    }
    ${userDetailsFragment}
`;

export const logoutMutation = gql`
    mutation Logout {
        logout
    }
`;

export const viewerQuery = gql`
    query Viewer {
        viewer {
            ...userDetails
            globalPermissions {
                artist {
                    create
                }
                card {
                    create
                }
                change {
                    create
                }
                collection {
                    create
                }
                dating {
                    create
                }
                institution {
                    create
                }
                user {
                    create
                }
                domain {
                    create
                }
                documentType {
                    create
                }
                antiqueName {
                    create
                }
                news {
                    create
                }
                period {
                    create
                }
                material {
                    create
                }
                tag {
                    create
                }
            }
        }
    }
    ${userDetailsFragment}
`;
