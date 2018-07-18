package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.ThinkAloud;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ThinkAloud entity.
 */
public interface ThinkAloudSearchRepository extends ElasticsearchRepository<ThinkAloud, Long> {
}
