import { TestBed } from '@angular/core/testing';
import { PaginationService, DEFAULT_PAGINATION, DEFAULT_PAGE_SIZES } from './pagination.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Paginatable } from '@shared/models/query.model';

describe('PaginationService', () => {
  let service: PaginationService;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { queryParams: {} },
    });

    TestBed.configureTestingModule({
      providers: [
        PaginationService,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    });

    service = TestBed.inject(PaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updatePagination', () => {
    it('should update the pagination state', () => {
      const newPagination: Paginatable = { page: 2, size: 10 };

      service.updatePagination(newPagination);

      expect(service.pagination()).toEqual(newPagination);
    });

    it('should update query params when configured', () => {
      service.config.set({ updateQueryParams: true });
      const newPagination = { page: 3 } satisfies Partial<Paginatable>;

      service.updatePagination(newPagination);

      expect(routerSpy.navigate).toHaveBeenCalledWith([], {
        relativeTo: activatedRouteSpy,
        queryParams: { ...newPagination, size: DEFAULT_PAGINATION.size },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    it('should not update query params if config is disabled', () => {
      service.config.set({ updateQueryParams: false });

      service.updatePagination({ page: 4 });

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('initializePaginationFromUrl', () => {
    it('should set pagination from query params', () => {
      activatedRouteSpy.snapshot.queryParams = { page: '5', size: '15' };

      service.initializePaginationFromUrl();

      expect(service.pagination()).toEqual({ page: 5, size: 15 });
      expect(service.config()).toEqual({ updateQueryParams: true });
    });

    it('should use default values if query params are missing', () => {
      activatedRouteSpy.snapshot.queryParams = {};

      service.initializePaginationFromUrl();

      expect(service.pagination()).toEqual(DEFAULT_PAGINATION);
    });

    it('should update config based on provided parameters', () => {
      activatedRouteSpy.snapshot.queryParams = { page: '2', size: '5' };

      service.initializePaginationFromUrl({ updateQueryParams: false });

      expect(service.config()).toEqual({ updateQueryParams: false });
    });
  });

  describe('resetPagination', () => {
    it('should reset pagination and total items', () => {
      service.totalItems.set(100);
      service.updatePagination({ page: 3, size: 20 });

      service.resetPagination();

      expect(service.totalItems()).toBe(0);
      expect(service.pagination()).toEqual({ ...DEFAULT_PAGINATION, size: 20 });
    });
  });

  describe('Signals and Observables', () => {
    it('should emit pagination updates as an observable', (done) => {
      service.pagination$.subscribe((pagination) => {
        expect(pagination).toEqual({ page: 2, size: 15 });
        done();
      });

      service.updatePagination({ page: 2, size: 15 });
    });
  });
});
