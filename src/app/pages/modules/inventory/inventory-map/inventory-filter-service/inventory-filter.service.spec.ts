import { TestBed } from '@angular/core/testing';

import { InventoryFilterService } from './inventory-filter.service';

describe('InventoryFilterService', () => {
  let service: InventoryFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
