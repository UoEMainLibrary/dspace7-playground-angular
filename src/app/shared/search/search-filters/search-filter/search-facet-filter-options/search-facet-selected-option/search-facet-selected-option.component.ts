import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { SearchFilterConfig } from '../../../../models/search-filter-config.model';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { currentPath } from '../../../../../utils/route.utils';
import { AppliedFilter } from '../../../../models/applied-filter.model';
import { map } from 'rxjs/operators';
import { PaginationService } from '../../../../../../core/pagination/pagination.service';

@Component({
  selector: 'ds-search-facet-selected-option',
  styleUrls: ['./search-facet-selected-option.component.scss'],
  templateUrl: './search-facet-selected-option.component.html',
})

/**
 * Represents a single selected option in a filter facet
 */
export class SearchFacetSelectedOptionComponent implements OnInit {
  /**
   * The value for this component
   */
  @Input() selectedValue: AppliedFilter;

  /**
   * The filter configuration for this facet option
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * UI parameters when this filter is removed
   */
  removeQueryParams: Observable<Params>;

  /**
   * Link to the search page
   */
  searchLink: string;

  constructor(
    protected paginationService: PaginationService,
    protected router: Router,
    protected searchService: SearchService,
    protected searchConfigService: SearchConfigurationService,
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.removeQueryParams = this.updateRemoveParams();
  }

  /**
   * Calculates the parameters that should change if this {@link selectedValue} would be removed from the active filters
   */
  updateRemoveParams(): Observable<Params> {
    const page: string = this.paginationService.getPageParam(this.searchConfigService.paginationID);
    return this.searchConfigService.unselectAppliedFilterParams(this.selectedValue.filter, this.selectedValue.value, this.selectedValue.operator).pipe(
      map((params: Params) => ({
        ...params,
        [page]: 1,
      })),
    );
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

}
