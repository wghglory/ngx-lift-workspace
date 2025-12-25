import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserCardComponent} from './user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', {
      id: {name: 'id', value: '1'},
      name: {title: 'Mr', first: 'Test', last: 'User'},
      email: 'test@example.com',
      phone: '123-456-7890',
      cell: '123-456-7890',
      gender: 'male',
      picture: {large: '', medium: '', thumbnail: ''},
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
