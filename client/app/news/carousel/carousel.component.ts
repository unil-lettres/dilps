import {Component, OnInit} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {NewsesVariables} from '../../shared/generated-types';
import {NewsService} from '../services/news.service';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
    public swiperConfig: SwiperConfigInterface = {
        direction: 'horizontal',
        autoplay: true,
        speed: 1000,
        a11y: true,
        slidesPerView: 1,
        navigation: true,
    };

    public newses;

    constructor(public newsService: NewsService) {}

    ngOnInit() {
        const qvm = new NaturalQueryVariablesManager<NewsesVariables>();
        qvm.set('search', {filter: {groups: [{conditions: [{isActive: {equal: {value: true}}}]}]}});

        this.newsService.getAll(qvm).subscribe(result => {
            this.newses = result.items;
        });
    }
}
