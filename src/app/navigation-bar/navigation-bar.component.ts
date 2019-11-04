import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SearchService} from '../services/search.service';
import {TranslationService} from '../services/translation.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  isCollapsed = true;

  constructor(public router: Router, public search: SearchService, private translation: TranslationService) {
  }

  ngOnInit() {
  }
}
