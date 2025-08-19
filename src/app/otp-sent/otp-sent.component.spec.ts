import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpSentComponent } from './otp-sent.component';

describe('OtpSentComponent', () => {
  let component: OtpSentComponent;
  let fixture: ComponentFixture<OtpSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpSentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
