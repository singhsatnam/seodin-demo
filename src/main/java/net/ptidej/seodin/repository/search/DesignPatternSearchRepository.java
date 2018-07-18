package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.DesignPattern;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the DesignPattern entity.
 */
public interface DesignPatternSearchRepository extends ElasticsearchRepository<DesignPattern, Long> {
}
