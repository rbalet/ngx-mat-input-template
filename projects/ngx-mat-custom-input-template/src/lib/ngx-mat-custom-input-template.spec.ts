import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatCustomInputTemplate } from './ngx-mat-custom-input-template';

describe('NgxMatCustomInputTemplate', () => {
  let component: NgxMatCustomInputTemplate;
  let fixture: ComponentFixture<NgxMatCustomInputTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatCustomInputTemplate],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMatCustomInputTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
