import { TestBed } from '@angular/core/testing';
import { SortService } from './sort.service';
import { Sort } from '@angular/material/sort';

describe('SortService', () => {
  let service: SortService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SortService],
    });

    service = TestBed.inject(SortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update sorting when sorting by a new column', () => {
    const sortEvent: Sort = { active: 'name', direction: 'asc' };
    service.updateSorting(sortEvent);
    expect(service.sortParams().field).toBe('name');
    expect(service.sortParams().direction).toBe('asc');
  });

  it('should update sorting when sorting by a new column with existing one', () => {
    const initialSortEvent: Sort = { active: 'name', direction: 'desc' };
    service.updateSorting(initialSortEvent);
    const finalSortEvent: Sort = { active: 'test', direction: 'asc' };
    service.updateSorting(finalSortEvent);
    expect(service.sortParams().field).toBe(finalSortEvent.active);
    expect(service.sortParams().direction).toBe(finalSortEvent.direction);
  });

  it('should update direction when sorting the same column', () => {
    const sortEvent1: Sort = { active: 'name', direction: 'asc' };
    service.updateSorting(sortEvent1);

    const sortEvent2: Sort = { active: 'name', direction: 'desc' };
    service.updateSorting(sortEvent2);

    expect(service.sortParams().field).toBe('name');
    expect(service.sortParams().direction).toBe('desc');
  });

  it('should reset sorting', () => {
    service.updateSorting({ active: 'name', direction: 'asc' });
    service.resetSorting();
    expect(service.sortParams().field).toBe('');
    expect(service.sortParams().direction).toBe('');
  });
});
