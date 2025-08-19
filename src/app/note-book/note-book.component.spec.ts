import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteBookComponent } from './note-book.component';

describe('NoteBookComponent', () => {
  let component: NoteBookComponent;
  let fixture: ComponentFixture<NoteBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
