import { Injectable } from '@angular/core';
import { dataService } from '../../../core/data/base/data-service.decorator';
import { IdentifiableDataService } from '../../../core/data/base/identifiable-data.service';
import { FindAllData, FindAllDataImpl } from '../../../core/data/base/find-all-data';
import { DeleteData, DeleteDataImpl } from '../../../core/data/base/delete-data';
import { RequestService } from '../../../core/data/request.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import { map, take } from 'rxjs/operators';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { MultipartPostRequest } from '../../../core/data/request.models';
import { RestRequest } from '../../../core/data/rest-request.model';
import { COAR_NOTIFY_WORKSPACEITEM } from './section-coar-notify-service.resource-type';
import { LdnService } from '../../../admin/admin-ldn-services/ldn-services-model/ldn-services.model';
import { SubmissionCoarNotifyConfig } from './submission-coar-notify.config';


/**
 * A service responsible for fetching/sending data from/to the REST API on the ldnservices endpoint
 */
@Injectable()
@dataService(COAR_NOTIFY_WORKSPACEITEM)
export class SectionCoarNotifyWorkspaceitemsDataService extends IdentifiableDataService<SubmissionCoarNotifyConfig> implements FindAllData<SubmissionCoarNotifyConfig>, DeleteData<LdnService>, PatchData<LdnService>, CreateData<LdnService> {
  createData: CreateDataImpl<LdnService>;
  private findAllData: FindAllDataImpl<LdnService>;
  private deleteData: DeleteDataImpl<LdnService>;
  private patchData: PatchDataImpl<LdnService>;
  private comparator: ChangeAnalyzer<LdnService>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('ldnservices', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
    this.patchData = new PatchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.comparator, this.responseMsToLive, this.constructIdEndpoint);
    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
  }


  create(object: LdnService): Observable<RemoteData<LdnService>> {
    return this.createData.create(object);
  }

  patch(object: LdnService, operations: Operation[]): Observable<RemoteData<LdnService>> {
    return this.patchData.patch(object, operations);
  }

  update(object: LdnService): Observable<RemoteData<LdnService>> {
    return this.patchData.update(object);
  }

  commitUpdates(method?: RestRequestMethod): void {
    return this.patchData.commitUpdates(method);
  }

  createPatchFromCache(object: LdnService): Observable<Operation[]> {
    return this.patchData.createPatchFromCache(object);
  }

  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<LdnService>[]): Observable<RemoteData<PaginatedList<LdnService>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  public delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(objectId, copyVirtualMetadata);
  }

  public deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }

  public invoke(serviceName: string, serviceId: string, parameters: ldnServiceConstrain[], files: File[]): Observable<RemoteData<LdnService>> {
    const requestId = this.requestService.generateRequestId();
    this.getBrowseEndpoint().pipe(
      take(1),
      map((endpoint: string) => new URLCombiner(endpoint, serviceName, 'processes', serviceId).toString()),
      map((endpoint: string) => {
        const body = this.getInvocationFormData(parameters, files);
        return new MultipartPostRequest(requestId, endpoint, body);
      })
    ).subscribe((request: RestRequest) => this.requestService.send(request));

    return this.rdbService.buildFromRequestUUID<LdnService>(requestId);
  }

  public ldnServiceWithNameExistsAndCanExecute(scriptName: string): Observable<boolean> {
    return this.findById(scriptName).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<LdnService>) => {
        return hasValue(rd.payload);
      }),
    );
  }

  private getInvocationFormData(constrain: ldnServiceConstrain[], files: File[]): FormData {
    const form: FormData = new FormData();
    form.set('properties', JSON.stringify(constrain));
    files.forEach((file: File) => {
      form.append('file', file);
    });
    return form;
  }
}
