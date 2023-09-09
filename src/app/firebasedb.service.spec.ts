import { TestBed } from '@angular/core/testing';

import { FirebaseServiceDatabase } from './firebasedb.service';

describe('FirebaseServiceDatabase', () => {
  let service: FirebaseServiceDatabase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseServiceDatabase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
