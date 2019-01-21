import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  isCollapsed = true;
  activePage = '/';

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  public setActive(page: string): void {
    this.activePage = page;
  }
}
