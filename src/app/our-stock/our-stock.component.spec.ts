import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurStockComponent } from './our-stock.component';

describe('OurStockComponent', () => {
  let component: OurStockComponent;
  let fixture: ComponentFixture<OurStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
