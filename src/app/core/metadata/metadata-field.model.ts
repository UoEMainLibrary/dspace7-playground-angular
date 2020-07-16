import { autoserialize, deserialize } from 'cerialize';
import { map } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { link, typedObject } from '../cache/builders/build-decorators';
import { MetadataSchemaDataService } from '../data/metadata-schema-data.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALLink } from '../shared/hal-link.model';
import { HALResource } from '../shared/hal-resource.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../shared/operators';
import { ResourceType } from '../shared/resource-type';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { METADATA_FIELD } from './metadata-field.resource-type';
import { MetadataSchema } from './metadata-schema.model';
import { RemoteData } from '../data/remote-data';
import { Observable } from 'rxjs';
import { METADATA_SCHEMA } from './metadata-schema.resource-type';

/**
 * Class the represents a metadata field
 */
@typedObject
export class MetadataField extends ListableObject implements HALResource {
  static type = METADATA_FIELD;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this metadata field
   */
  @autoserialize
  id: number;

  /**
   * The element of this metadata field
   */
  @autoserialize
  element: string;

  /**
   * The qualifier of this metadata field
   */
  @autoserialize
  qualifier: string;

  /**
   * The scope note of this metadata field
   */
  @autoserialize
  scopeNote: string;

  /**
   * The {@link HALLink}s for this MetadataField
   */
  @deserialize
  _links: {
    self: HALLink,
    schema: HALLink
  };

  /**
   * The MetadataSchema for this MetadataField
   * Will be undefined unless the schema {@link HALLink} has been resolved.
   */
  @link(METADATA_SCHEMA)
  schema?: Observable<RemoteData<MetadataSchema>>;

  schemaResolved?: MetadataSchema;

  /**
   * Method to print this metadata field as a string without the schema
   * @param separator The separator between element and qualifier in the string
   */
  toString(separator: string = '.'): string {
    let key = this.element;
    if (isNotEmpty(this.qualifier)) {
      key += separator + this.qualifier;
    }
    return key;
  }

  /**
   * Method to print this metadata field as a string
   * @param separator The separator between the schema, element and qualifier in the string
   */
  toStringWithSchema(separator: string = '.', schemaService: MetadataSchemaDataService): Observable<string> {
    let schemaObject: Observable<RemoteData<MetadataSchema>> = this.schema;
    if (!hasValue(this.schema)) {
      schemaObject = schemaService.findByHref(this._links.schema.href);
    }
    return schemaObject.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      map((schemaPayload: MetadataSchema) => {
        let key = this.element;
        if (isNotEmpty(this.qualifier)) {
          key += separator + this.qualifier;
        }
        return schemaPayload.namespace + separator + key;
      })
    )
  }

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
