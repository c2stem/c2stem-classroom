import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelbuildComponent } from './modelbuild.component';

describe('ModelbuildComponent', () => {
  let component: ModelbuildComponent;
  let fixture: ComponentFixture<ModelbuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelbuildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelbuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
