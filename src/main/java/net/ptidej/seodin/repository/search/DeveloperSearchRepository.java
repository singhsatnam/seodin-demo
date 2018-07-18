package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.Developer;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Developer entity.
 */
public interface DeveloperSearchRepository extends ElasticsearchRepository<Developer, Long> {
}
