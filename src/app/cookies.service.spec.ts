import { TestBed } from '@angular/core/testing';

import { cookies } from './cookies.service';

describe('CookiesService', () => {
  let service: cookies;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(cookies);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
