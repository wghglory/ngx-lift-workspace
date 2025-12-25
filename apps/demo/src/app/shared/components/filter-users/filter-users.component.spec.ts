import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterUsersComponent} from './filter-users.component';

describe('FilterUsersComponent', () => {
  let component: FilterUsersComponent;
  let fixture: ComponentFixture<FilterUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterUsersComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
