import { Item } from '../../../../core/shared/item.model';
import { OrgUnitGridElementComponent } from './org-unit-grid-element.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { mockTruncatableService } from '../../../../shared/mocks/mock-trucatable.service';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthServiceMock } from '../../../../shared/mocks/auth.service.mock';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';

const mockItem = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'organization.foundingDate': [
      {
        language: null,
        value: '2015-06-26'
      }
    ],
    'organization.address.addressCountry': [
      {
        language: 'en_US',
        value: 'Belgium'
      }
    ],
    'organization.address.addressLocality': [
      {
        language: 'en_US',
        value: 'Brussels'
      }
    ]
  }
});

describe('OrgUnitGridElementComponent', () => {
  let comp;
  let fixture;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        NoopAnimationsModule,
        TruncatePipe,
        TranslateModule.forRoot(),
        OrgUnitGridElementComponent
    ],
    providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: BitstreamDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} },
    ],
    schemas: [NO_ERRORS_SCHEMA]
}).overrideComponent(OrgUnitGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OrgUnitGridElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the org unit is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a OrgUnitGridElementComponent`, () => {
      const orgUnitGridElement = fixture.debugElement.query(By.css(`ds-org-unit-search-result-grid-element`));
      expect(orgUnitGridElement).not.toBeNull();
    });
  });
});
