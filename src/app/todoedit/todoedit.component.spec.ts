import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoeditComponent } from './todoedit.component';

describe('TodoeditComponent', () => {
  let component: TodoeditComponent;
  let fixture: ComponentFixture<TodoeditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoeditComponent]
    });
    fixture = TestBed.createComponent(TodoeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
