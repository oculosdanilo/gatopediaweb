import { TestBed } from '@angular/core/testing';

import { FirebaseServiceStorage } from './firebasest.service';

describe('FirebaseServiceStorage', () => {
  let service: FirebaseServiceStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseServiceStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
