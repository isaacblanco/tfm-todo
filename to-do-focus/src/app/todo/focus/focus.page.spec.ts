import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FocusPage } from './focus.page';

describe('FocusPage', () => {
  let component: FocusPage;
  let fixture: ComponentFixture<FocusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
