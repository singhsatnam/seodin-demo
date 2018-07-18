package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.SoftwareSystem;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SoftwareSystem entity.
 */
public interface SoftwareSystemSearchRepository extends ElasticsearchRepository<SoftwareSystem, Long> {
}
