import { Component, Inject } from '@angular/core';
import { StatisticService } from '../services/statistic.service';
import { NaturalAbstractController, NaturalQueryVariablesManager, Literal } from '@ecodev/natural';
import {
    ExtraStatistics, Site,
    SortingOrder,
    StatisticFilter,
    StatisticSortingField,
    StatisticsVariables, UserFilter, Users_users_items,
} from '../../shared/generated-types';
import { StatisticInput } from '../statistic/statistic.component';
import { Apollo } from 'apollo-angular';
import { extraStatisticsQuery } from '../services/statistic.queries';
import { UserService } from '../../users/services/user.service';
import { SITE } from '../../app.config';

function formatDate(date: Date): string {
    const month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);

    return date.getFullYear() + '-' + month;
}

interface Period {
    name: string;
    key: string;
    filter: StatisticFilter;
}

interface Values {
    pageCount: number;
    detailCount: number;
    searchCount: number;
    uniqueLoginCount: number;
}
interface Stat {
    name: string;
    values: Values;
}

interface Data {
    anonymous: Stat;
    default: Stat;
    unil: Stat;
    total: Stat;
}

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistic.component.scss'],
})
export class StatisticsComponent extends NaturalAbstractController {

    public frequentationQvm = new NaturalQueryVariablesManager<StatisticsVariables>();
    public data: Data;
    public statType: keyof Values = 'pageCount';
    public cardType = 'cardCreation';
    public userType = 'userCreation';
    private series: Map<keyof Values, any> = new Map();

    public availableTypes = {
        pageCount: 'Visites de page',
        detailCount: 'Visites de détail de fiche',
        searchCount: 'Recherches',
        uniqueLoginCount: 'Login uniques',
    };

    public availableCardTypes = {
        cardCreation: 'Création de fiche',
        cardUpdate: 'Modification de fiche',
    };

    public availableUserTypes = {
        userCreation: 'Création d\'utilisateur',
        userUpdate: 'Modification d\'utilisateur',
    };

    public availablePeriods: Period[] = [];
    public period: string;
    private categories: string[] = [];
    public frequentation: StatisticInput;
    public cards: StatisticInput;
    public users: StatisticInput;
    private raw: Literal;
    public user: Users_users_items | null;

    // public usersFilter: UserFilter;

    constructor(
        private apollo: Apollo,
        statisticService: StatisticService,
        public userService: UserService,
        @Inject(SITE) site: Site,
    ) {
        super();

        this.frequentationQvm.set('pagination', {
            pagination: {
                pageSize: 999,
            },
            sorting: [{
                field: StatisticSortingField.date,
                order: SortingOrder.ASC,
            }],
        });

        this.buildAvailablePeriods();
        this.period = this.availablePeriods[0].key;
        this.reset();
        this.update();

        statisticService.watchAll(this.frequentationQvm, this.ngUnsubscribe).subscribe(result => {
            this.reset();

            const seriesData = {
                anonymous: {
                    pageCount: [],
                    detailCount: [],
                    searchCount: [],
                    uniqueLoginCount: [],
                },
                default: {
                    pageCount: [],
                    detailCount: [],
                    searchCount: [],
                    uniqueLoginCount: [],
                },
                unil: {
                    pageCount: [],
                    detailCount: [],
                    searchCount: [],
                    uniqueLoginCount: [],
                },
            };

            result.items.map(s => {
                this.data.total.values.detailCount += s.anonymousDetailCount + s.defaultDetailCount + s.unilDetailCount;
                this.data.total.values.pageCount += s.anonymousPageCount + s.defaultPageCount + s.unilPageCount;
                this.data.total.values.searchCount += s.anonymousSearchCount + s.defaultSearchCount + s.unilSearchCount;
                this.data.total.values.uniqueLoginCount += s.defaultUniqueLoginCount + s.unilUniqueLoginCount;

                this.data.anonymous.values.detailCount += s.anonymousDetailCount;
                this.data.default.values.detailCount += s.defaultDetailCount;
                this.data.unil.values.detailCount += s.unilDetailCount;

                this.data.anonymous.values.pageCount += s.anonymousPageCount;
                this.data.default.values.pageCount += s.defaultPageCount;
                this.data.unil.values.pageCount += s.unilPageCount;

                this.data.anonymous.values.searchCount += s.anonymousSearchCount;
                this.data.default.values.searchCount += s.defaultSearchCount;
                this.data.unil.values.searchCount += s.unilSearchCount;

                this.data.default.values.uniqueLoginCount += s.defaultUniqueLoginCount;
                this.data.unil.values.uniqueLoginCount += s.unilUniqueLoginCount;

                this.categories.push(s.date);

                seriesData.anonymous.pageCount.push(s.anonymousPageCount);
                seriesData.default.pageCount.push(s.defaultPageCount);
                seriesData.unil.pageCount.push(s.unilPageCount);

                seriesData.anonymous.detailCount.push(s.anonymousDetailCount);
                seriesData.default.detailCount.push(s.defaultDetailCount);
                seriesData.unil.detailCount.push(s.unilDetailCount);

                seriesData.anonymous.searchCount.push(s.anonymousSearchCount);
                seriesData.default.searchCount.push(s.defaultSearchCount);
                seriesData.unil.searchCount.push(s.unilSearchCount);

                seriesData.default.uniqueLoginCount.push(s.defaultUniqueLoginCount);
                seriesData.unil.uniqueLoginCount.push(s.unilUniqueLoginCount);
            });

            console.log(seriesData);
            this.buildOneSeries(seriesData, 'pageCount');
            this.buildOneSeries(seriesData, 'detailCount');
            this.buildOneSeries(seriesData, 'searchCount');
            this.buildOneSeries(seriesData, 'uniqueLoginCount');

            this.applyFrequentationTypeSelection();
        });
    }

    private reset(): void {
        this.series.clear();
        this.categories = [];
        this.data = {
            anonymous: {
                name: 'Visiteurs',
                values: {
                    pageCount: 0,
                    detailCount: 0,
                    searchCount: 0,
                    uniqueLoginCount: 0,
                },
            },
            default: {
                name: 'Utilisateurs externes',
                values: {
                    pageCount: 0,
                    detailCount: 0,
                    searchCount: 0,
                    uniqueLoginCount: 0,
                },
            },
            unil: {
                name: 'Utilisateurs UNIL',
                values: {
                    pageCount: 0,
                    detailCount: 0,
                    searchCount: 0,
                    uniqueLoginCount: 0,
                },
            },
            total: {
                name: 'Total',
                values: {
                    pageCount: 0,
                    detailCount: 0,
                    searchCount: 0,
                    uniqueLoginCount: 0,
                },
            },
        };
    }

    private buildOneSeries(seriesData, key: keyof Values): void {
        this.series.set(key, [
            {
                name: this.data.unil.name,
                data: seriesData.unil[key],
            },
            {
                name: this.data.default.name,
                data: seriesData.default[key],
            },
            {
                name: this.data.anonymous.name,
                data: seriesData.anonymous[key],
            },
        ]);
    }

    private buildAvailablePeriods(): void {
        this.availablePeriods.push({
            key: 'month',
            name: 'Mois en cours',
            filter: {groups: [{conditions: [{date: {equal: {value: formatDate(new Date())}}}]}]},
        });

        this.availablePeriods.push({
            key: 'all',
            name: 'Tout',
            filter: {},
        });

        let year = new Date().getFullYear();
        const minimum = 2002;
        while (year >= minimum) {
            this.availablePeriods.push({
                key: '' + year,
                name: '' + year,
                filter: {
                    groups: [{
                        conditions: [{
                            date: {
                                greaterOrEqual: {value: formatDate(new Date(year + '-01-01'))},
                                less: {value: formatDate(new Date((year + 1) + '-01-01'))},
                            },
                        }],
                    }],
                },
            });

            year--;
        }

    }

    public update(): void {
        const period = this.availablePeriods.find(p => p.key === this.period);
        this.frequentationQvm.set('filter', {filter: period.filter});
        this.applyFrequentationTypeSelection();
        this.fetchCardAndUser();
    }

    public applyFrequentationTypeSelection(): void {
        this.frequentation = {
            tables: [{
                name: this.availableTypes[this.statType],
                rows: [
                    {name: this.data.unil.name, value: this.data.unil.values[this.statType]},
                    {name: this.data.default.name, value: this.data.default.values[this.statType]},
                    {name: this.data.anonymous.name, value: this.data.anonymous.values[this.statType]},
                ],
            }],
            chart: {
                name: this.availableTypes[this.statType],
                categories: this.categories,
                series: this.series.get(this.statType) || [],
            },
        };
    }

    public applyCardAndUserTypeSelection() {
        this.cards = this.raw[this.cardType];
        this.users = this.raw[this.userType];
    }

    private fetchCardAndUser(): void {
        this.apollo.query<ExtraStatistics>({
            query: extraStatisticsQuery,
            variables: {
                period: this.period,
                user: this.user ? this.user.id : null,
            },
        }).subscribe(result => {
            this.raw = JSON.parse(result.data.extraStatistics);
            this.applyCardAndUserTypeSelection();
        });
    }

    public displayFn(item) {
        return item ? item.login : null;
    }
}