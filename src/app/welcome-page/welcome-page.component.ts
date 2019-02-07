import {Component, OnInit} from '@angular/core';
import {SearchService} from '../services/search.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  constructor(public search: SearchService) {
  }

  ngOnInit() {
  }

}
