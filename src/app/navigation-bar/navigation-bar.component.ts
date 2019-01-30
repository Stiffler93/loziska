import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SearchService} from '../services/search.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  isCollapsed = true;

  constructor(private router: Router, private search: SearchService) {
  }

  ngOnInit() {
  }
}
