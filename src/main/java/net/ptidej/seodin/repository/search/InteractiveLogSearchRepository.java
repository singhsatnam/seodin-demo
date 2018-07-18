package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.InteractiveLog;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the InteractiveLog entity.
 */
public interface InteractiveLogSearchRepository extends ElasticsearchRepository<InteractiveLog, Long> {
}
