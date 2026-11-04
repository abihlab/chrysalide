import { i18n } from './i18n.svelte'
import { resources, type Resource } from './resources-data'
import { fuzzySearch } from './utils'

type MedicationCatalog = 'commonNames' | 'dosageUnits' | 'stockUnits' | 'frequencies'

/** Display only: canonical catalog values and user-entered text remain unchanged. */
export function catalogLabel(catalog: MedicationCatalog, value: string): string {
  const labels = i18n.raw<Record<string, string>>(`medications.${catalog}`)
  return labels && Object.hasOwn(labels, value) ? labels[value]! : value
}

export function localizedResources(): Resource[] {
  const tags = i18n.raw<Record<string, string>>('resources.tags')
  return resources.map((resource) => ({
    ...resource,
    name: i18n.t(`resources.items.${resource.id}.name`),
    description: i18n.t(`resources.items.${resource.id}.description`),
    tags: resource.tags.map((tag) => (tags && Object.hasOwn(tags, tag) ? tags[tag]! : tag)),
  }))
}

export function searchLocalizedResources(query: string, catalog: Resource[]): Resource[] {
  return catalog.filter((resource) =>
    [resource.name, resource.description, ...resource.tags].some((text) => fuzzySearch(text, query))
  )
}
