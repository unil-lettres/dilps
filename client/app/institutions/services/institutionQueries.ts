import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const institutionsQuery = gql`
query Institutions($filters: InstitutionFilter, $pagination: PaginationInput) {
    institutions(filters: $filters, pagination: $pagination) {
        items {
            id
            name
        }
        pageSize
        pageIndex
        length
    }
}`;

export const institutionQuery = gql`
query Institution($id: InstitutionID!) {
    institution(id: $id) {
        id
        name
        creationDate
        creator {
            ...userMeta
        }
        updateDate
        updater {
            ...userMeta
        }
    }
}${userMetaFragment}`;

export const createInstitutionMutation = gql`
mutation CreateInstitution ($input: InstitutionInput!) {
    createInstitution (input: $input) {
        id
        creationDate
        creator {
            ...userMeta
        }
    }
}${userMetaFragment}`;

export const updateInstitutionMutation = gql`
mutation UpdateInstitution($id: InstitutionID!, $input: InstitutionInput!) {
    updateInstitution(id: $id, input: $input) {
        updateDate
        updater {
            ...userMeta
        }
    }
}${userMetaFragment}`;

export const deleteInstitutionMutation = gql`
mutation DeleteInstitution ($id: InstitutionID!){
    deleteInstitution(id: $id)
}`;